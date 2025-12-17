import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaBox,
} from "react-icons/fa";

import api from "../api/axios";

/* ================= STATUS STYLES ================= */
const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderDetails() {
  const { id } = useParams(); // MongoDB _id
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Order fetch failed", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8fbc8f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!order) {
    return (
      <section className="pt-24 text-center">
        <p className="text-red-600 font-semibold">Order not found</p>
      </section>
    );
  }
console.log(order);
  return (
    <section className="bg-[#faf8f6] min-h-screen pt-5 pb-16">
      <div className="max-w-5xl mx-auto px-6 space-y-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <FaArrowLeft /> Back to Orders
        </button>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border shadow-sm"
        >
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <h1 className="text-xl font-semibold text-gray-900">
                {order.orderId}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toDateString()}
              </p>
            </div>

            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusStyles[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        </motion.div>

        {/* ITEMS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-5">Ordered Items</h2>

          <div className="space-y-4">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FaBox className="text-gray-400" />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Product ID: {item.productId}
                  </p>
                  <p className="text-sm text-gray-500">
                    SKU: {item.variantSku} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* DELIVERY + PAYMENT */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* ADDRESS */}
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <div className="flex gap-3 text-gray-700 text-sm">
              <FaMapMarkerAlt />
              <p>
                {order.shippingAddress.fullName} <br />
                {order.shippingAddress.street} <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} <br />
                {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-3xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <div className="flex items-center gap-3">
              {order.paymentMethod === "COD" ? (
                <FaMoneyBillWave />
              ) : (
                <FaCreditCard />
              )}
              <div>
                <p className="font-medium">{order.paymentMethod}</p>
                <p className="text-sm text-gray-500">
                  Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRICE SUMMARY */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.priceSummary.subtotal}</span>
            </div>

            {order.priceSummary.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-₹{order.priceSummary.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{order.priceSummary.total}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
