import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";
import { profileDummy } from "../data/profileDummy";

export default function Profile() {
  const [user, setUser] = useState(profileDummy);
  const [editMode, setEditMode] = useState(false);

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">

        {/* ================= PROFILE HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border flex flex-col sm:flex-row items-center gap-6"
        >
          <img
            src={user.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover"
          />

          <div className="flex-1 w-full">
            {!editMode ? (
              <>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {user.fullName}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-2">
                    <FaEnvelope /> {user.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaPhone /> {user.phone}
                  </span>
                </div>
              </>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  className="input"
                  value={user.fullName}
                  onChange={(e) =>
                    setUser({ ...user, fullName: e.target.value })
                  }
                />
                <input
                  className="input"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                />
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Member since {new Date(user.createdAt).toDateString()}
            </p>
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className="px-5 py-2 rounded-xl bg-[#9a6b63] text-white hover:bg-[#875a53] transition flex items-center gap-2"
          >
            <FaEdit />
            {editMode ? "Save" : "Edit"}
          </button>
        </motion.div>

        {/* ================= ORDER STATS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaBox />} label="Total Orders" value={user.stats.totalOrders} />
          <StatCard icon={<FaCheckCircle />} label="Delivered" value={user.stats.delivered} color="green" />
          <StatCard icon={<FaClock />} label="Pending" value={user.stats.pending} color="yellow" />
          <StatCard icon={<FaTimesCircle />} label="Cancelled" value={user.stats.cancelled} color="red" />
        </div>

        {/* ================= ADDRESSES ================= */}
        <div className="bg-white rounded-3xl p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Saved Addresses
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {user.addresses.map((addr) => (
              <div
                key={addr._id}
                className={`rounded-2xl p-4 border ${
                  addr.isDefault
                    ? "border-[#9a6b63] bg-[#9a6b63]/5"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-900">{addr.fullName}</p>
                  {addr.isDefault && (
                    <span className="text-xs bg-[#9a6b63] text-white px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1" />
                  {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                </p>

                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <FaPhone /> {addr.phone}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ACCOUNT ACTIONS ================= */}
        <div className="bg-white rounded-3xl p-6 border">
          <button className="flex items-center gap-3 text-red-600 hover:underline">
            <FaSignOutAlt /> Logout
          </button>
        </div>

      </div>
    </section>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ icon, label, value, color = "gray" }) {
  const colors = {
    gray: "text-gray-700",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white border rounded-2xl p-5 flex items-center gap-4">
      <div className={`text-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
