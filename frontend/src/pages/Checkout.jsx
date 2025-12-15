import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    loading,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = () => {
    setPlacingOrder(true);

    setTimeout(() => {
      alert(
        paymentMethod === "COD"
          ? "Order placed successfully (Cash on Delivery) ✅"
          : "Redirecting to Razorpay... (Mock Payment) 💳"
      );

      setPlacingOrder(false);
      navigate("/");
    }, 1200);
  };

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">

        {/* ================= LEFT SECTION ================= */}
        <div className="lg:col-span-2 space-y-10">

          {/* DELIVERY ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Delivery Address
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter the address where you want your order delivered
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <input placeholder="Full Name" className={inputClass} />
              <input placeholder="Phone Number" className={inputClass} />
              <input
                placeholder="Street Address"
                className={`${inputClass} sm:col-span-2`}
              />
              <input placeholder="City" className={inputClass} />
              <input placeholder="Pincode" className={inputClass} />
            </div>
          </motion.div>

          {/* PAYMENT METHOD */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Payment Method
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Choose a preferred payment option
            </p>

            <div className="space-y-4">
              {/* COD */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
                  ${
                    paymentMethod === "COD"
                      ? "border-[#8fbc8f] bg-[#8fbc8f]/10"
                      : "border-gray-200 hover:border-[#8fbc8f]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-[#8fbc8f]" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
              </label>

              {/* ONLINE */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
                  ${
                    paymentMethod === "ONLINE"
                      ? "border-[#8fbc8f] bg-[#8fbc8f]/10"
                      : "border-gray-200 hover:border-[#8fbc8f]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-[#8fbc8f]" />
                  <span className="font-medium">
                    Online Payment (Razorpay)
                  </span>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
              </label>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 border h-fit lg:sticky lg:top-28"
        >
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          {/* ITEMS */}
          <div className="space-y-3 text-sm">
            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between text-gray-700">
                <span className="max-w-[70%]">
                  {item.productName} ({item.variant.weight}) × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.variant.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {/* COUPON */}
          {!appliedCoupon ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#9a6b63]/40"
              />
              <button
                onClick={() => applyCoupon(couponInput)}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-[#8fbc8f] text-white hover:bg-[#93c572]"
              >
                {loading ? "Applying..." : "Apply"}
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="text-green-700 text-sm">
                Coupon <strong>{appliedCoupon}</strong> applied
              </span>
              <button
                onClick={removeCoupon}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          <hr className="my-4" />

          {/* PRICE */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* PLACE ORDER */}
          <button
            disabled={placingOrder || loading}
            onClick={handlePlaceOrder}
            className={`mt-6 w-full py-3 rounded-xl text-white text-lg transition
              ${
                placingOrder || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#8fbc8f] hover:bg-[#93c572]"
              }`}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Checkout;

/* ================= INPUT STYLE ================= */
const inputClass =
  "w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#8fbc8f]";
