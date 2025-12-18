import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getMySubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} from "../api/index.api";
import { GiMilkCarton } from "react-icons/gi";


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

  <button
    onClick={() => (window.location.href = "/products")}
    className="
      mt-4 px-6 py-3 rounded-xl
      bg-[#8fbc8f] text-white font-medium
      hover:bg-[#93c572] transition
    "
  >
    Browse Products
  </button>
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
              className="bg-white rounded-3xl border p-6 space-y-3 shadow-sm"
            >
              {/* PRODUCT */}
              <h2 className="font-semibold text-lg text-gray-900">
                {sub.product?.productName || "Product"}
              </h2>

              {/* PLAN */}
              <p className="text-sm text-gray-600">
                Plan: <strong>{formatPlan(sub.frequency)}</strong>
              </p>

              {/* DETAILS */}
              <p className="text-sm text-gray-600">
                Quantity / day: {sub.quantityPerDay}
              </p>

              <p className="text-sm text-gray-600">
                Variant: {sub.variantSku}
              </p>

              <p className="text-sm text-gray-600">
                Start: {new Date(sub.startDate).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600">
                End: {new Date(sub.endDate).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600">
                Total Paid: ₹{sub.totalAmount}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[sub.status]}`}
              >
                {sub.status}
              </span>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3 pt-3">
                {sub.status === "ACTIVE" && (
                  <button
                    disabled={actionLoading === sub._id}
                    onClick={() => handlePause(sub._id)}
                    className="px-4 py-2 rounded-xl bg-yellow-500 text-white text-sm disabled:opacity-60"
                  >
                    Pause
                  </button>
                )}

                {sub.status === "PAUSED" && (
                  <button
                    disabled={actionLoading === sub._id}
                    onClick={() => handleResume(sub._id)}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm disabled:opacity-60"
                  >
                    Resume
                  </button>
                )}

                {sub.status !== "CANCELLED" && (
                  <button
                    disabled={actionLoading === sub._id}
                    onClick={() => handleCancel(sub._id)}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
