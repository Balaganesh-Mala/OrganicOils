import { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  validateCoupon,
} from "../api/index.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponError, setCouponError] = useState(null);

  /* ================= LOAD CART ================= */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCartItems(res.data.cart?.items || []);
    } catch (err) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  /* ================= CALCULATIONS ================= */
  const subtotal = cartItems.reduce((sum, item) => {
    const variant = item.product?.variants?.find(
      (v) => v.sku === item.variantSku
    );

    if (!variant) return sum;

    return sum + variant.price * item.quantity;
  }, 0);

  const total = Math.max(subtotal - discount, 0);

  /* ================= ADD TO CART ================= */
  const addItem = async ({ productId, variantSku, quantity }) => {
    try {
      await addToCart({ productId, variantSku, quantity });
      await fetchCart();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to add item",
        "error"
      );
    }
  };
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (variantSku, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartItem({ variantSku, quantity });
      await fetchCart();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Unable to update quantity",
        "error"
      );
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeFromCart = async (variantSku) => {
    try {
      await removeCartItem(variantSku);
      await fetchCart();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Unable to remove item",
        "error"
      );
    }
  };

  /* ================= COUPON ================= */
  const applyCoupon = async (code) => {
    try {
      setCouponError(null);

      const res = await validateCoupon({
        code,
        cartTotal: subtotal,
      });

      setDiscount(res.data.coupon.discount);
      setAppliedCoupon(code.toUpperCase());
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);

      setCouponError(err || "Invalid coupon");
      console.log(err);
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        discount,
        total,
        loading,
        fetchCart,
        addItem,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        couponError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
