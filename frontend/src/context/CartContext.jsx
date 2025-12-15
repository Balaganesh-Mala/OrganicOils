import { createContext, useContext, useState } from "react";
import { coupons } from "../data/coupons";
import { cartDummy } from "../data/cartDummy";



const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ PRELOAD DUMMY CART (TEMP – remove when backend is ready)
  const [cartItems, setCartItems] = useState(cartDummy.items);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= CALCULATIONS ================= */

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  const total = Math.max(subtotal - discount, 0);

  /* ================= APPLY COUPON ================= */

  const applyCoupon = (code) => {
    setLoading(true);

    setTimeout(() => {
      const coupon = coupons.find(
        (c) => c.code === code.toUpperCase()
      );

      if (!coupon || !coupon.isActive) {
        alert("Invalid coupon code ❌");
        setLoading(false);
        return;
      }

      if (subtotal < coupon.minCartValue) {
        alert(`Minimum cart value ₹${coupon.minCartValue} required`);
        setLoading(false);
        return;
      }

      if (new Date(coupon.expiry) < new Date()) {
        alert("Coupon expired ❌");
        setLoading(false);
        return;
      }

      let discountAmount = 0;

      if (coupon.type === "PERCENT") {
        discountAmount = (subtotal * coupon.value) / 100;

        if (coupon.maxDiscount) {
          discountAmount = Math.min(
            discountAmount,
            coupon.maxDiscount
          );
        }
      }

      if (coupon.type === "FLAT") {
        discountAmount = coupon.value;
      }

      discountAmount = Math.min(discountAmount, subtotal);

      setDiscount(discountAmount);
      setAppliedCoupon(coupon.code);
      setLoading(false);
    }, 800); // simulate API delay
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
  };

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = (sku, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.variant.sku === sku
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(quantity, item.variant.maxStock)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (sku) => {
    setCartItems((prev) =>
      prev.filter((item) => item.variant.sku !== sku)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        subtotal,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        updateQuantity,
        removeItem,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
