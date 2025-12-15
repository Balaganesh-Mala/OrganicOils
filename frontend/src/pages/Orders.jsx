import { Link } from "react-router-dom";
import { ordersDummy } from "../data/ordersDummy";
import { motion } from "framer-motion";
import {
  FaBox,
  FaMoneyBillWave,
  FaCreditCard,
  FaEye,
} from "react-icons/fa";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function Orders() {
  return (
    <section className="bg-[#faf8f6] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and track your orders
          </p>
        </motion.div>

        {/* EMPTY STATE */}
        {ordersDummy.length === 0 ? (
          <div className="text-center py-20">
            <FaBox className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border shadow-sm overflow-hidden"
          >
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Items</th>
                    <th className="px-6 py-4 font-medium">Payment</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Total
                    </th>
                    <th className="px-6 py-4 font-medium text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ordersDummy.map((order, index) => (
                    <motion.tr
                      key={order.orderId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      {/* ORDER ID */}
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.orderId}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toDateString()}
                      </td>

                      {/* ITEMS COUNT */}
                      <td className="px-6 py-4 text-gray-600">
                        {order.items.length} item(s)
                      </td>

                      {/* PAYMENT */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          {order.paymentMethod === "COD" ? (
                            <FaMoneyBillWave className="text-[#8fbc8f]" />
                          ) : (
                            <FaCreditCard className="text-[#8fbc8f]" />
                          )}
                          {order.paymentMethod}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* TOTAL */}
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        ₹{order.priceSummary.total}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/orders/${order.orderId}`}
                          className="inline-flex items-center gap-2 px-4 py-2
                                     rounded-lg text-sm font-medium
                                     bg-[#8fbc8f]/10 text-[#8fbc8f]
                                     hover:bg-[#8fbc8f]/20 transition"
                        >
                          <FaEye />
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
