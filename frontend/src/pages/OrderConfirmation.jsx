import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const { order, payment } = location.state || {};

  if (!order) {
    return (
      <main className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <h2>No order details found.</h2>
        <Link to="/" className="text-blue-400 ml-2">Go Home</Link>
      </main>
    );
  }

  return (
    <main className="bg-gray-900 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg text-white flex flex-col gap-6">
        <h1 className="text-3xl font-bold mb-6">Order Confirmed!</h1>

        <div className="flex flex-col gap-2">
          <p><strong>Name:</strong> {order.guest_name}</p>
          <p><strong>Email:</strong> {order.guest_email}</p>
          <p><strong>Phone:</strong> {order.guest_phone}</p>
          {order.guest_address && <p><strong>Address:</strong> {order.guest_address}</p>}
          <p><strong>Payment Method:</strong> {order.payment_method}</p>
          <p><strong>Total:</strong> ${order.total_amount.toFixed(2)}</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg flex flex-col gap-2">
          <h2 className="font-bold">Items:</h2>
          {order.cart_items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {payment && <pre className="text-sm bg-gray-900 p-2 rounded">{JSON.stringify(payment, null, 2)}</pre>}
        </div>

        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
