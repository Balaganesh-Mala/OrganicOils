import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getProductById,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  createSubscription,
  getMyProfile,
} from "../api/index.api";

export default function Subscribe() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [plan, setPlan] = useState("MONTHLY");
  const [qty, setQty] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [addressId, setAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [variantIndex, setVariantIndex] = useState(0);

  /* ================= LOAD PRODUCT + USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
          getProductById(productId),
          getMyProfile(),
        ]);

        const prod = productRes.data.product;
        const userAddresses = userRes.data.user.addresses || [];

        setProduct(prod);
        setAddresses(userAddresses);

        // ✅ AUTO SELECT: Default → First address
        const selectedAddress =
          userAddresses.find((addr) => addr.isDefault) || userAddresses[0];

        if (selectedAddress) {
          setAddressId(selectedAddress._id);
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load subscription data", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, navigate]);

  /* ================= SAFE GUARD ================= */
  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8fbc8f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const variant = product?.variants?.[variantIndex];

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product variant not available
      </div>
    );
  }

  const pricePerUnit = variant.price;

  const previewDays = plan === "DAILY" ? 1 : plan === "WEEKLY" ? 7 : 30;

  const totalAmount = pricePerUnit * qty * previewDays;
  const hasAddresses = addresses.length > 0;

  /* ================= PAY & SUBSCRIBE ================= */
  const handleSubscribe = async () => {
    if (!startDate || !addressId) {
      Swal.fire("Missing details", "Select date & address", "warning");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      Swal.fire("Invalid date", "Start date cannot be in the past", "warning");
      return;
    }

    try {
      const { data } = await createSubscriptionOrder({
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        order_id: data.razorpayOrder.id,
        name: "Milk Subscription",
        handler: async (response) => {
          const verifyRes = await verifySubscriptionPayment({
            ...response,
            amount: totalAmount,
          });

          await createSubscription({
            productId: product._id,
            variantSku: variant.sku,
            frequency: plan,
            quantityPerDay: qty,
            startDate,
            addressId,
            paymentId: verifyRes.data.payment._id,
          });

          Swal.fire("Success", "Subscription activated", "success");
          navigate("/subscriptions");
        },
        theme: { color: "#8fbc8f" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Subscription failed", "error");
    }
  };
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          max-w-lg md:max-w-2xl mx-auto
          px-4 sm:px-6 space-y-6
          bg-white p-6 sm:p-8
          rounded-3xl border shadow-sm
        "
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Milk Subscription
          </h1>
          <p className="text-sm text-gray-500">
            Fresh delivery at your doorstep
          </p>
        </div>

        {/* PRODUCT */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border">
          <img
            src={product.images?.[0]?.url}
            alt={product.productName}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <p className="font-medium">{product.productName}</p>
            <p className="text-sm text-gray-600">₹{pricePerUnit} / unit</p>
          </div>
        </div>

        {/* PLAN + QTY + DATE + ADDRESS */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* PLAN */}
          <div className="bg-white rounded-2xl p-5 border">
            <p className="font-medium mb-3">Choose plan</p>
            <div className="grid grid-cols-3 gap-2">
              {["DAILY", "WEEKLY", "MONTHLY"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`py-2 rounded-lg text-sm font-medium transition
                    ${
                      plan === p
                        ? "bg-[#8fbc8f] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* VARIANT */}
          <div className="bg-white rounded-2xl p-5 border">
            <p className="font-medium mb-3">Select quantity</p>

            <div className="flex gap-2 flex-wrap">
              {product.variants.map((v, index) => (
                <button
                  key={v.sku}
                  onClick={() => setVariantIndex(index)}
                  className={`
          px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            variantIndex === index
              ? "bg-[#8fbc8f] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>

          {/* START DATE */}
          <div className="bg-white rounded-2xl p-5 border space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Start date
            </label>

            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
      w-full rounded-xl border border-gray-300
      px-4 py-3 text-sm
      focus:outline-none focus:ring-2 focus:ring-[#8fbc8f]
      transition
    "
            />
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-2xl p-5 border">
            <p className="font-medium mb-3">Delivery address</p>

            {hasAddresses ? (
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
              >
                {addresses.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {`${addr.fullName}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-600">
                No address found.{" "}
                <button
                  onClick={() => navigate("/profile")}
                  className="underline font-medium text-[#8fbc8f]"
                >
                  Add address
                </button>
              </p>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-[#f7f7f5] rounded-2xl p-5 border">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total days</span>
            <span>{previewDays}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Total amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          disabled={!hasAddresses}
          onClick={handleSubscribe}
          className={`w-full py-4 rounded-xl font-semibold
            ${
              hasAddresses
                ? "bg-[#8fbc8f] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Subscribe & Pay
        </motion.button>

        <p className="text-xs text-center text-gray-500">
          Secure payment • Pause or cancel anytime
        </p>
      </motion.div>
    </section>
  );
}
