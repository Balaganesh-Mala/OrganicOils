// src/api/index.api.js
import api from "./axios";

/* ================= AUTH ================= */
export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const getProfile = () => api.get("/auth/profile");

/* ================= PRODUCTS ================= */
export const getProducts = (params = {}) => api.get("/products", { params });

export const getProductById = (id) => api.get(`/products/${id}`);

/* ================= CATEGORIES ================= */
export const getCategories = () => api.get("/categories");

/* ================= CART (BACKEND) ================= */
export const getCart = () => api.get("/cart");

export const addToCart = (data) => api.post("/cart/add", data);

export const updateCartItem = (data) => api.put("/cart/update", data);

export const removeCartItem = (sku) => api.delete(`/cart/remove/${sku}`);

/* ================= COUPONS ================= */
export const validateCoupon = (data) => api.post("/coupons/validate", data);

/* ================= ORDERS ================= */
export const createOrder = (data) => api.post("/orders", data);

export const getMyOrders = () => api.get("/orders/my"); // ✅ FIXED

export const getOrderById = (id) => api.get(`/orders/${id}`);

/* ================= PAYMENTS ================= */
export const createRazorpayOrder = (data) =>
  api.post("/payments/create-order", data);

export const verifyRazorpayPayment = (data) =>
  api.post("/payments/verify", data);


export const createSubscriptionOrder = (data) =>
  api.post("/payments/subscription/create-order", data);

export const verifySubscriptionPayment = (data) =>
  api.post("/payments/subscription/verify", data);



/* ================= ADDRESSES ================= */

// Add new address
export const addAddress = (data) => {
  return api.post("/users/address", data);
};

// Update address
export const updateAddress = (addressId, data) => {
  return api.put(`/users/address/${addressId}`, data);
};

// Delete address
export const deleteAddress = (addressId) => {
  return api.delete(`/users/address/${addressId}`);
};

// Set default address
export const setDefaultAddress = (addressId) => {
  return api.patch(`/users/address/${addressId}/default`);
};

/* ================= USER PROFILE ================= */

// Get my profile
export const getMyProfile = () => {
  return api.get("/users/me");
};

// Update profile (name, phone, avatar)
export const updateProfile = (formData) => {
  return api.put("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/* ================= VIDEOS ================= */
export const uploadVideo = (formData) => {
  return api.post("/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getVideos = () => {
  return api.get("/videos");
};

export const updateVideo = (id, data) => {
  return api.put(`/videos/${id}`, data);
};

export const deleteVideo = (id) => {
  return api.delete(`/videos/${id}`);
};


export const getPublicSettings = () => {
  return api.get("/settings/public");
};

/* ================= SUBSCRIPTIONS ================= */

export const createSubscription = (data) =>
  api.post("/subscriptions", data);

export const getMySubscriptions = () =>
  api.get("/subscriptions/my");

export const pauseSubscription = (id) =>
  api.put(`/subscriptions/${id}/pause`);

export const resumeSubscription = (id) =>
  api.put(`/subscriptions/${id}/resume`);

export const cancelSubscription = (id) =>
  api.put(`/subscriptions/${id}/cancel`);
