import { useEffect } from "react";
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from "react-icons/fa";

import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    total,
    loading,
    updateQuantity,
    removeFromCart,
    fetchCart,
  } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8fbc8f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <section className=" mx-auto px-6 pt-24 pb-20">
        <div className="flex flex-col items-center justify-center text-center py-16 ">
          <FaShoppingCart className="text-6xl text-gray-300 mb-4" />

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-6 max-w-sm">
            Looks like you haven’t added anything to your cart yet.
          </p>

          <Link
            to={"/products"}
            className="px-6 py-2 rounded-xl bg-[#8fbc8f] text-white hover:bg-[#7aa97a] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* ================= ITEMS ================= */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const variant = item.product.variants.find(
              (v) => v.sku === item.variantSku
            );

            if (!variant) return null;

            return (
              <motion.div
                key={item.variantSku}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-2xl p-4 flex gap-4"
              >
                {/* IMAGE */}
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.productName}
                  className="w-24 h-24 rounded-xl object-cover border"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.product.productName}
                  </h3>

                  <p className="text-sm text-gray-500">{variant.weight}</p>

                  <p className="text-sm text-gray-600 mt-1">
                    ₹{variant.price} × {item.quantity}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantSku, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 border rounded-md flex items-center justify-center disabled:opacity-40"
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="min-w-[24px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.variantSku, item.quantity + 1)
                      }
                      disabled={item.quantity >= variant.stock}
                      className="w-8 h-8 border rounded-md flex items-center justify-center disabled:opacity-40"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Remove item?",
                      text: "Do you want to remove this item from cart?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#8fbc8f",
                      confirmButtonText: "Yes, remove",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        removeFromCart(item.variantSku);
                      }
                    })
                  }
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <FaTrash />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="bg-white border rounded-2xl p-6 h-fit lg:sticky lg:top-28">
          <h3 className="text-lg font-semibold mb-4">Price Summary</h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 py-3 rounded-xl bg-[#8fbc8f] text-white text-lg hover:bg-[#93c572] transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
