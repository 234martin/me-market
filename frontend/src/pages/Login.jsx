import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 3D tilt states
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = e => {
    const card = e.currentTarget;
    const { width, height, left, top } = card.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    const rX = ((height / 2 - y) / 20).toFixed(2);
    const rY = ((x - width / 2) / 20).toFixed(2);

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      setError("");
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
      <motion.div
        className="relative"
        style={{
          perspective: 1200,
        }}
      >
        {/* Glow behind card */}
        <div className="absolute -inset-20 bg-gradient-to-r from-indigo-700/30 via-purple-600/20 to-blue-500/30 blur-3xl rounded-full opacity-70"></div>

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          className="
            relative z-10 backdrop-blur-2xl
            bg-white/10 border border-white/20 
            p-10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]
            w-[380px]
          "
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-400 text-center font-medium mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-5">
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white/5 border border-white/20 text-white
                  focus:border-indigo-400 outline-none
                  transition-all
                "
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="password"
                className="
                  w-full mt-1 p-3 rounded-xl
                  bg-white/5 border border-white/20 text-white
                  focus:border-indigo-400 outline-none
                  transition-all
                "
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="
                w-full p-3 mt-2 rounded-xl font-bold text-white 
                bg-gradient-to-r from-indigo-600 to-blue-500
                shadow-[0_0_20px_rgba(99,102,241,0.5)]
                hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]
                transition-all
              "
              type="submit"
            >
              Login
            </motion.button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Don't have an account?{" "}
            <Link className="text-indigo-300 font-medium" to="/register">
              Register
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
