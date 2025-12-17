import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBox,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../api/index.api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      Swal.fire({
        title: "Welcome Back 👋",
        text: "Login successful",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/"); // redirect to home
    } catch (error) {
      Swal.fire(
        "Login Failed ❌",
        error?.response?.data?.message || "Invalid credentials",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ================= LEFT SIDE (INFO / BRAND) ================= */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#8fbc8f] text-white">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>

          <p className="text-lg text-white/90 max-w-md">
            Login to manage your orders, saved addresses, and enjoy a smooth
            shopping experience.
          </p>

          <div className="mt-8 space-y-4 text-white/90">
            <p className="flex items-center gap-3">
              <FaShieldAlt className="text-white text-lg" />
              Quick & secure login
            </p>

            <p className="flex items-center gap-3">
              <FaBox className="text-white text-lg" />
              Track your orders
            </p>

            <p className="flex items-center gap-3">
              <FaBolt className="text-white text-lg" />
              Faster checkout
            </p>
          </div>
        </motion.div>
      </div>

      {/* ================= RIGHT SIDE (FORM) ================= */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#f6faf6]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 border shadow-lg"
        >
          {/* HEADER */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Login to your account
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Welcome back! Please enter your details
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-[#8fbc8f]/40"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-[#8fbc8f]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-medium
              ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#8fbc8f] hover:bg-[#7daa7d]"
              }
              text-white transition`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#8fbc8f] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
