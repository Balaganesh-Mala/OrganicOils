import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import { getMyProfile } from "../api/index.api";

import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/index.api";

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
    couponError,
    loading,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const loadDefaultAddress = async () => {
      try {
        const res = await getMyProfile();
        const user = res.data.user;

        const defaultAddress = user.addresses?.find((addr) => addr.isDefault);

        if (defaultAddress) {
          setAddress({
            fullName: defaultAddress.fullName,
            phone: defaultAddress.phone,
            street: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            pincode: defaultAddress.pincode,
          });
        }
      } catch (err) {
        console.log("No default address found");
      }
    };

    loadDefaultAddress();
  }, []);

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      Swal.fire("Missing details", "Please fill delivery address", "warning");
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire("Cart Empty", "Please add items to cart", "warning");
      return;
    }

    try {
      setPlacingOrder(true);

      /* ---------- BUILD ORDER ITEMS ---------- */
      const orderItems = cartItems.map((item) => {
        const variant = item.product.variants.find(
          (v) => v.sku === item.variantSku
        );

        return {
          productId: item.product._id,
          variantSku: item.variantSku,
          quantity: item.quantity,
          price: variant.price,
        };
      });

      /* ---------- CREATE ORDER ---------- */
      const orderRes = await createOrder({
        orderItems,
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon || null,
      });

      const order = orderRes.data.order;

      /* ---------- COD FLOW ---------- */
      if (paymentMethod === "COD") {
        removeCoupon();
        setCouponInput("");
        Swal.fire("Order Placed", "Cash on Delivery confirmed", "success");
        navigate(`/orders/${order._id}`);
        return;
      }

      /* ---------- ONLINE PAYMENT ---------- */
      const razorRes = await createRazorpayOrder({
        amount: order.priceSummary.total,
        orderId: order._id,
      });

      const razorpayOrder = razorRes.data.razorpayOrder;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Organic Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order._id,
          });
          removeCoupon();
          setCouponInput("");
          Swal.fire("Payment Successful", "Order confirmed", "success");
          navigate(`/orders/${order._id}`);
        },
        theme: { color: "#8fbc8f" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Order failed",
        "error"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="bg-[#faf8f6] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-10">
          {/* ADDRESS */}
          <motion.div className="bg-white rounded-3xl p-8 border">
            <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <input
                placeholder="Full Name"
                value={address.fullName}
                className={inputClass}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
              />

              <input
                placeholder="Phone"
                value={address.phone}
                className={inputClass}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              />

              <input
                placeholder="Street Address"
                value={address.street}
                className={`${inputClass} sm:col-span-2`}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />

              <input
                placeholder="City"
                value={address.city}
                className={inputClass}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />

              <input
                placeholder="State"
                value={address.state}
                className={inputClass}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />

              <input
                placeholder="Pincode"
                value={address.pincode}
                className={inputClass}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </div>
          </motion.div>

          {/* PAYMENT */}
          <motion.div className="bg-white rounded-3xl p-8 border">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

            <div className="space-y-4">
              <label className={paymentMethod === "COD" ? activePay : pay}>
                <FaMoneyBillWave />
                Cash on Delivery
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
              </label>

              <label className={paymentMethod === "ONLINE" ? activePay : pay}>
                <FaCreditCard />
                Online Payment (Razorpay)
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
              </label>
            </div>
          </motion.div>
        </div>

        {/* ================= SUMMARY ================= */}
        <motion.div className="bg-white rounded-3xl p-6 border h-fit">
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          {cartItems.map((item, i) => {
            const variant = item.product.variants.find(
              (v) => v.sku === item.variantSku
            );

            return (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.product.productName} ({variant.weight}) ×{" "}
                  {item.quantity}
                </span>
                <span>₹{variant.price * item.quantity}</span>
              </div>
            );
          })}

          <hr className="my-4" />

          {/* COUPON */}
          {!appliedCoupon ? (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={() => applyCoupon(couponInput)}
                  className="px-4 py-2 bg-[#8fbc8f] text-white rounded-lg"
                >
                  Apply
                </button>
              </div>

              {/* 🔴 ERROR MESSAGE */}
              {couponError && (
                <p className="mt-2 text-sm text-red-500">{couponError}</p>
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center mb-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="text-green-700 text-sm">
                Coupon <strong>{appliedCoupon}</strong> applied
              </span>
              <button onClick={removeCoupon} className="text-sm text-red-500">
                Remove
              </button>
            </div>
          )}

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

          <button
            disabled={placingOrder || loading}
            onClick={handlePlaceOrder}
            className="mt-6 w-full py-3 rounded-xl bg-[#8fbc8f] text-white"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Checkout;

/* ================= STYLES ================= */
const inputClass =
  "w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#8fbc8f]";

const pay =
  "flex items-center justify-between p-4 border rounded-xl cursor-pointer";

const activePay =
  "flex items-center justify-between p-4 border rounded-xl cursor-pointer border-[#8fbc8f] bg-[#8fbc8f]/10";
