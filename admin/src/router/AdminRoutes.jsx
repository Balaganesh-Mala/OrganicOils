import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminAuthProvider from "../context/AdminAuthContext";

import Login from "../pages/admin/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

import DashboardHome from "../pages/admin/DashboardHome.jsx";
import Products from "../pages/admin/Products.jsx";

import Orders from "../pages/admin/Orders.jsx";
import OrderDetails from "../pages/admin/OrderDetails.jsx";
import Users from "../pages/admin/Users.jsx";
import Payments from "../pages/admin/Payments.jsx";
import Settings from "../pages/admin/Settings.jsx";
import Categories from "../pages/admin/Categories.jsx";
//import BlogManager from "../pages/admin/BlogManager.jsx";
import ContactMessages from "../pages/admin/ContactMessages.jsx";
import AdminVideos from "../pages/admin/AdminVideos.jsx";
import AdminCoupons from "../pages/admin/AdminCoupons.jsx";
import AdminHero from "../pages/admin/AdminHero.jsx";
import AdminSubscriptions from "../pages/admin/AdminSubscriptions.jsx";

import AdminProtectedRoute from "../components/common/ProtectedRoute.jsx";

const AdminRoutes = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Area */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="payments" element={<Payments />} />
          {/*<Route path="blogs" element={<BlogManager/>}/>*/}
          <Route path="settings" element={<Settings />} />
          <Route path="categories" element={<Categories />} />
          <Route path="messages" element={<ContactMessages />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="hero" element={<AdminHero/>}/>
          <Route path="subscriptions" element={<AdminSubscriptions/>}/>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminRoutes;
