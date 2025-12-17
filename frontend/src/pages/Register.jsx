import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser } from "../api/index.api";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      Swal.fire("Error", "Passwords do not match ❌", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      Swal.fire({
        title: "Success 🎉",
        text: "Account created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire(
        "Registration Failed ❌",
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f6faf6] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Join us and start shopping
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* FULL NAME */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-[#8fbc8f]/40"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           focus:ring-[#8fbc8f]/40"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Phone Number
            </label>
            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="10-digit mobile number"
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
                placeholder="Create password"
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

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Confirm password"
              className="w-full px-4 py-3 rounded-xl border
                         focus:outline-none focus:ring-2
                         focus:ring-[#8fbc8f]/40"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl
              ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#8fbc8f] hover:bg-[#7daa7d]"
              }
              text-white font-medium transition`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#8fbc8f] font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
