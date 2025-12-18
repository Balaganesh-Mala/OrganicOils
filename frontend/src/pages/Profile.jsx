import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEdit,
  FaPlus,
  FaTrash,
  FaStar,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";

import Swal from "sweetalert2";

import {
  getMyProfile,
  updateProfile,
  getMyOrders,
  deleteAddress,
  setDefaultAddress,
} from "../api/index.api";

import AddressForm from "../components/profile/AddressForm";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        getMyProfile(),
        getMyOrders(),
      ]);

      setUser(profileRes.data.user);
      setOrders(ordersRes.data.orders || []);
    } catch {
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    loadData();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid file", "Please select an image", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Too large", "Image must be under 5MB", "warning");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ================= PROFILE SAVE ================= */
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("phone", user.phone);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await updateProfile(formData);

      setUser(res.data.user);
      setEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      Swal.fire("Success", "Profile updated", "success");
    } catch {
      Swal.fire("Error", "Profile update failed", "error");
    }
  };

  /* ================= ORDER STATS ================= */
  const stats = {
    totalOrders: orders.length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    pending: orders.filter(
      (o) => o.status === "CONFIRMED" || o.status === "SHIPPED"
    ).length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  /* ================= ADDRESS HANDLERS ================= */
  const openAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setShowAddressModal(true);
  };

  const removeAddress = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    await deleteAddress(id);
    await loadData();
    Swal.fire("Deleted", "Address removed", "success");
  };

  const makeDefault = async (id) => {
    await setDefaultAddress(id);
    await loadData();
    Swal.fire("Success", "Default address updated", "success");
  };

  if (loading || !user) return null;

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-6 space-y-5">
        {/* PROFILE HEADER */}
        <motion.div
          className="
    bg-white rounded-3xl p-6 border
    flex flex-col sm:flex-row
    gap-6
    sm:items-center sm:justify-between
    mb-6
  "
        >
          {/* AVATAR */}
          <div className="relative w-24 h-24 mx-auto sm:mx-0">
            <img
              src={
                avatarPreview ||
                user.avatar?.url ||
                "https://ik.imagekit.io/izqq5ffwt/user-profile-pic.jpg" ||
                user.avatar
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border object-cover"
            />

            {/* CAMERA ICON */}
            <label
              htmlFor="avatarUpload"
              className="
      absolute bottom-0 right-0
      w-8 h-8 rounded-full
      bg-[#8fbc8f] text-white
      flex items-center justify-center
      cursor-pointer shadow-md
      hover:bg-[#7aa97a] transition
    "
            >
              <FaCamera size={14} />
            </label>

            {/* HIDDEN FILE INPUT */}
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* USER INFO */}
          <div className="flex-1 text-center sm:text-left">
            {!editMode ? (
              <>
                <h1 className="text-2xl font-semibold">{user.fullName}</h1>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center justify-center sm:justify-start gap-2">
                    <FaEnvelope />
                    <span className="break-all">{user.email}</span>
                  </span>

                  <span className="flex items-center justify-center sm:justify-start gap-2">
                    <FaPhone />
                    <span>{user.phone}</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() =>
                editMode ? handleSaveProfile() : setEditMode(true)
              }
              className="
        px-6 py-2 bg-[#8fbc8f] text-white rounded-xl
        flex items-center gap-2
        w-full sm:w-auto
      "
            >
              <FaEdit />
              {editMode ? "Save" : "Edit"}
            </button>
          </div>
        </motion.div>

        {/* ORDER STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaBox />}
            label="Total Orders"
            value={stats.totalOrders}
          />
          <StatCard
            icon={<FaCheckCircle />}
            label="Delivered"
            value={stats.delivered}
            color="green"
          />
          <StatCard
            icon={<FaClock />}
            label="Pending"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={<FaTimesCircle />}
            label="Cancelled"
            value={stats.cancelled}
            color="red"
          />
        </div>

        {/* ADDRESSES */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Saved Addresses
            </h2>

            <button
              onClick={openAddAddress}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                 bg-[#8fbc8f] text-white text-sm font-medium
                 hover:bg-[#7aa97a] transition"
            >
              <FaPlus className="text-sm" />
              Add New Address
            </button>
          </div>

          {/* ADDRESS LIST */}
          <div className="grid lg:grid-cols-2 gap-5">
            {user.addresses?.map((addr) => (
              <div
                key={addr._id}
                className={`relative rounded-2xl border p-5 transition
          ${
            addr.isDefault
              ? "border-[#8fbc8f] bg-[#8fbc8f]/10"
              : "border-gray-200 hover:border-gray-300"
          }`}
              >
                {/* DEFAULT BADGE */}
                {addr.isDefault && (
                  <span
                    className="absolute top-4 right-4 text-xs font-semibold
                           bg-[#8fbc8f] text-white px-3 py-1 rounded-full"
                  >
                    Default
                  </span>
                )}

                {/* NAME */}
                <p className="font-semibold text-gray-900 text-base">
                  {addr.fullName}
                </p>

                {/* ADDRESS */}
                <p className="mt-2 text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
                  <FaMapMarkerAlt className="mt-1 text-gray-400" />
                  <span>
                    {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                  </span>
                </p>

                {/* PHONE */}
                <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {addr.phone}
                </p>

                {/* ACTIONS */}
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
                  <button
                    onClick={() => openEditAddress(addr)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => removeAddress(addr._id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>

                  {!addr.isDefault && (
                    <button
                      onClick={() => makeDefault(addr._id)}
                      className="text-green-700 hover:underline flex items-center gap-1"
                    >
                      <FaStar /> Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {!user.addresses?.length && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No addresses saved yet.
            </div>
          )}
        </div>
        {/* ================= LOGOUT ================= */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 font-medium
               hover:text-red-700 transition"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <AddressForm
          editingAddress={editingAddress}
          onClose={() => setShowAddressModal(false)}
          onSuccess={loadData}
        />
      )}
    </section>
  );
}

/* STAT CARD */
function StatCard({ icon, label, value, color = "gray" }) {
  const colors = {
    gray: "text-gray-700",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white border rounded-2xl p-5 flex gap-4">
      <div className={`text-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
