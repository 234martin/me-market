import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    // Trigger reset API
    setMessage("Password reset link sent to your email!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <motion.form
        className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        onSubmit={handleReset}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Reset Password</h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <motion.button
          type="submit"
          className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send Reset Link
        </motion.button>
      </motion.form>
    </div>
  );
}
