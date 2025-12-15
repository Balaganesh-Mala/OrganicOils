import { useParams, useNavigate } from "react-router-dom";
import { ordersDummy } from "../data/ordersDummy";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaBox,
} from "react-icons/fa";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = ordersDummy.find(
    (o) => o.orderId === orderId
  );

  if (!order) {
    return (
      <section className="pt-24 text-center">
        <p className="text-red-600 font-semibold">
          Order not found
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-24 pb-16">
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
                Placed on
                {new Date(order.createdAt).toDateString()}
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
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-5">
            Ordered Items
          </h2>

          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover border"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.variant.weight} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  ₹{item.variant.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* DELIVERY + PAYMENT */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* DELIVERY ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 border shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">
              Delivery Address
            </h2>

            <div className="flex gap-3 text-gray-700 text-sm">
              <FaMapMarkerAlt className="mt-1 text-[#9a6b63]" />
              <p>
                John Doe <br />
                12-3-45, Market Road <br />
                Anantapur, Andhra Pradesh <br />
                515001
              </p>
            </div>
          </motion.div>

          {/* PAYMENT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl p-6 border shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">
              Payment Information
            </h2>

            <div className="flex items-center gap-3 text-gray-700">
              {order.paymentMethod === "COD" ? (
                <FaMoneyBillWave className="text-[#9a6b63]" />
              ) : (
                <FaCreditCard className="text-[#9a6b63]" />
              )}

              <div>
                <p className="font-medium">
                  {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PRICE SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 border shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span>₹{order.priceSummary.total}</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
