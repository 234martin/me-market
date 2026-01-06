import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="bg-gray-900 min-h-screen flex items-center justify-center px-6">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <Link
            to="/"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-900 min-h-screen py-12 px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Your Cart</h1>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-[1.02] transition transform hover:-translate-y-1"
          >
            <div className="w-full h-48 bg-black overflow-hidden">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-white font-semibold text-lg line-clamp-1">
                {item.name}
              </h4>
              <p className="text-gray-300 text-sm line-clamp-2 mt-1">
                {item.description || "No description available"}
              </p>
              <p className="text-green-400 font-bold text-lg mt-3">
                ${item.price?.toFixed(2)}
              </p>
              <p className="text-gray-300 mt-1">
                Quantity: {item.quantity || 1}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <p className="text-white text-2xl font-bold">
          Total: ${totalPrice?.toFixed(2)}
        </p>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={clearCart}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Clear Cart
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </main>
  );
}
