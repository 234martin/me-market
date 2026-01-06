import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(form.email, form.password);

    if (res.success) {
      toast.success("Logged in successfully!");
      navigate("/"); // redirect to home
    } else {
      toast.error(res.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="p-3 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="bg-green-600 p-3 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </main>
  );
}
