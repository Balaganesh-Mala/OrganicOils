import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getMySubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} from "../api/index.api";
import { GiMilkCarton } from "react-icons/gi";
import { Link } from "react-router-dom";

/* ================= HELPERS ================= */
const formatPlan = (freq) => {
  if (freq === "DAILY") return "Daily Subscription";
  if (freq === "WEEKLY") return "Weekly Subscription";
  if (freq === "MONTHLY") return "Monthly Subscription";
  return freq;
};

const statusStyles = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MySubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= LOAD SUBSCRIPTIONS ================= */
  const loadSubs = async () => {
    try {
      const res = await getMySubscriptions();
      setSubs(res.data.subscriptions || []);
    } catch (err) {
      console.error("Load subscriptions failed:", err);

      // ✅ DO NOT show error popup
      // ✅ Just show empty state
      setSubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubs();
  }, []);

  /* ================= ACTIONS ================= */

  const handlePause = async (id) => {
    try {
      setActionLoading(id);
      await pauseSubscription(id);
      Swal.fire("Paused", "Subscription paused", "success");
      loadSubs();
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (id) => {
    try {
      setActionLoading(id);
      await resumeSubscription(id);
      Swal.fire("Resumed", "Subscription resumed", "success");
      loadSubs();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Cancel subscription?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoading(id);
      await cancelSubscription(id);
      Swal.fire("Cancelled", "Subscription cancelled", "success");
      loadSubs();
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading subscriptions…
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (subs.length === 0) {
    return (
      <section className="bg-[#faf8f6] min-h-screen pt-16 pb-24">
        <div className="max-w-md mx-auto text-center space-y-4">
          {/* ICON */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#f1f7f1] flex items-center justify-center">
              <GiMilkCarton className="text-4xl text-[#8fbc8f]" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No subscriptions yet
          </h2>

          <p className="text-sm text-gray-500">
            Subscribe to daily milk delivery and never miss fresh milk again.
          </p>

          <Link
            to="/products"
            className="
    mt-4 inline-flex items-center justify-center
    px-6 py-3 rounded-xl
    bg-[#8fbc8f] text-white font-medium
    hover:bg-[#93c572] transition
  "
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <section className="bg-[#faf8f6] min-h-screen pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-semibold mb-6">My Subscriptions</h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {subs.map((sub) => (
            <div
              key={sub._id}
              className="
      bg-white border rounded-2xl
      p-5 md:p-6
      flex gap-4
      shadow-sm hover:shadow-md transition
    "
            >
              {/* RIGHT CONTENT */}
              <div className="flex-1 space-y-3">
                {/* TITLE */}
                <div className="flex justify-between item-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {sub.product?.productName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatPlan(sub.frequency)}
                    </p>
                  </div>
                  {/* LEFT ICON + STATUS */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="
          w-12 h-12 rounded-full
          bg-[#f1f7f1]
          flex items-center justify-center
        "
                    >
                      <GiMilkCarton className="text-2xl text-[#8fbc8f]" />
                    </div>

                    <span
                      className={`
          px-3 py-1 rounded-full
          text-xs font-semibold
          ${statusStyles[sub.status]}
        `}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
                <hr className="my-2" />
                {/* META */}
                <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                  <p>Quantity</p>
                  <p className="text-right font-medium">
                    {sub.quantityPerDay} / day
                  </p>

                  <p>Variant</p>
                  <p className="text-right">{sub.variantSku}</p>

                  <p>Start</p>
                  <p className="text-right">
                    {new Date(sub.startDate).toLocaleDateString()}
                  </p>

                  <p>End</p>
                  <p className="text-right">
                    {new Date(sub.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* PRICE */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500">Total paid</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{sub.totalAmount}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-3">
                  {sub.status === "ACTIVE" && (
                    <button
                      disabled={actionLoading === sub._id}
                      onClick={() => handlePause(sub._id)}
                      className="
              flex-1 py-2 rounded-lg
              bg-yellow-100 text-yellow-800
              text-sm font-medium
              hover:bg-yellow-200 transition
            "
                    >
                      Pause
                    </button>
                  )}

                  {sub.status === "PAUSED" && (
                    <button
                      disabled={actionLoading === sub._id}
                      onClick={() => handleResume(sub._id)}
                      className="
              flex-1 py-2 rounded-lg
              bg-green-100 text-green-800
              text-sm font-medium
              hover:bg-green-200 transition
            "
                    >
                      Resume
                    </button>
                  )}

                  {sub.status !== "CANCELLED" && (
                    <button
                      disabled={actionLoading === sub._id}
                      onClick={() => handleCancel(sub._id)}
                      className="
              flex-1 py-2 rounded-lg
              bg-red-100 text-red-700
              text-sm font-medium
              hover:bg-red-200 transition
            "
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
