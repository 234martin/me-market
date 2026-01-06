import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    type: "buyer", // default
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = register(form);

    if (res.success) {
      toast.success("Account created successfully!");
      navigate("/"); // redirect to home
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl flex flex-col gap-4 w-full max-w-md shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Create Account</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="buyer"
              checked={form.type === "buyer"}
              onChange={handleChange}
              className="accent-green-500"
            />
            Buyer
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="seller"
              checked={form.type === "seller"}
              onChange={handleChange}
              className="accent-green-500"
            />
            Seller
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 transition px-4 py-3 rounded font-semibold mt-4"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
