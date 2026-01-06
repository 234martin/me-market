import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        </div>
      </main>
    );
  }

  const handlePayment = async () => {
    if (!user && (!guestName || !guestEmail)) {
      toast.error("Please enter your name and email to checkout as guest.");
      return;
    }

    setLoading(true);

    const payload = {
      amount: totalPrice,
      currency: "USD",
      method: paymentMethod,
      items: cartItems,
      guest: user ? null : { name: guestName, email: guestEmail },
      user_id: user ? user.id : null,
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/purchase", payload);

      toast.success(res.data.message);
      clearCart();
      navigate("/");
    } catch (err) {
      console.error("Checkout error:", err.response || err);
      toast.error("Payment failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg text-white flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Guest Info */}
        {!user && (
          <div className="flex flex-col gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="p-2 rounded text-black"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="p-2 rounded text-black"
            />
          </div>
        )}

        {/* Cart Summary */}
        <div className="bg-gray-700 p-4 rounded-lg flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="flex flex-col gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            Stripe
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            PayPal
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="mpesa"
              checked={paymentMethod === "mpesa"}
              onChange={() => setPaymentMethod("mpesa")}
            />
            M-Pesa
          </label>
        </div>

        <button
          onClick={handlePayment}
          className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </div>
    </main>
  );
}
