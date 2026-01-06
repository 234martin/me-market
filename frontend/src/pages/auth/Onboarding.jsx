import React from "react";
import { motion } from "framer-motion";

export default function Onboarding() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-2xl text-white text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6">Welcome to the Marketplace</h2>
        <p className="text-gray-300 mb-6">
          Complete your onboarding to start selling or buying products seamlessly.
        </p>
        <motion.button
          className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
