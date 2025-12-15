import { useCart } from "../context/CartContext";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Cart() {
  const {
    cartItems,
    subtotal,
    discount,
    total,
    updateQuantity,
    removeFromCart,
    loading,
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8fbc8f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.variant.sku}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-2xl p-4 flex gap-4"
              >
                {/* IMAGE */}
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-xl border"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.productName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.variant.weight}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    ₹{item.variant.price} × {item.quantity}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variant.sku,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 border rounded-md flex items-center justify-center"
                    >
                      <FaMinus size={12} />
                    </button>

                    <span className="min-w-[24px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variant.sku,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border rounded-md flex items-center justify-center"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeFromCart(item.productId, item.variant.sku)
                  }
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-white border rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">
              Price Summary
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* CHECKOUT */}
            <button
              className="w-full mt-6 py-3 rounded-xl text-white text-lg
                         bg-[#8fbc8f] hover:bg-[#93c572] transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
