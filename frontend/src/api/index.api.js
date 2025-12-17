// src/api/index.api.js
import api from "./axios";

/* ================= AUTH ================= */
export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");

/* ================= PRODUCTS ================= */
export const getProducts = (params = {}) =>
  api.get("/products", { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

/* ================= CATEGORIES ================= */
export const getCategories = () =>
  api.get("/categories");

/* ================= CART (BACKEND) ================= */
export const getCart = () =>
  api.get("/cart");

export const addToCart = (data) =>
  api.post("/cart/add", data);

export const updateCartItem = (data) =>
  api.put("/cart/update", data);

export const removeCartItem = (sku) =>
  api.delete(`/cart/remove/${sku}`);

/* ================= COUPONS ================= */
export const validateCoupon = (data) =>
  api.post("/coupons/validate", data);

/* ================= ORDERS ================= */
export const createOrder = (data) =>
  api.post("/orders", data);

export const getMyOrders = () =>
  api.get("/orders/my");   // ✅ FIXED

export const getOrderById = (id) =>
  api.get(`/orders/${id}`);


/* ================= PAYMENTS ================= */
export const createRazorpayOrder = (data) =>
  api.post("/payments/create-order", data);

export const verifyRazorpayPayment = (data) =>
  api.post("/payments/verify", data);


