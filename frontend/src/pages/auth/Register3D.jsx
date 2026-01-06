import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Register3D() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("buyer"); // default user type

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = register(name, email, password, type);
    if (res.success) {
      toast.success("Account created successfully!");
      navigate("/"); // Redirect to Home
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 perspective-1000">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <motion.button
          type="submit"
          className="w-full p-3 bg-green-600 hover:bg-green-500 rounded text-white font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>

        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link className="text-indigo-400" to="/login">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
