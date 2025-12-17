import express from "express";
import {
  registerAdmin,
  adminLogin,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { adminProtect } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/dashboard", adminProtect, getDashboardStats);

export default router;
