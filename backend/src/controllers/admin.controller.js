import asyncHandler from "express-async-handler";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

/* ================= ADMIN REGISTER (ONE TIME) ================= */
export const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, password, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    res.status(403);
    throw new Error("Invalid Admin Secret Key");
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({
    fullName,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
    },
  });
});

/* ================= ADMIN LOGIN ================= */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  admin.lastLogin = new Date();
  await admin.save();

  res.json({
    success: true,
    message: "Admin login successful",
    token: admin.generateToken(),
    admin: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
    },
  });
});

/* ================= DASHBOARD STATS ================= */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
    },
  });
});
