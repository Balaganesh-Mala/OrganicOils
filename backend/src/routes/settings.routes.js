import express from "express";
import upload from "../middleware/settingsUpload.middleware.js";

import {
  getSettings,
  updateSettings
} from "../controllers/settings.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminProtect } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public route → no login needed ✅
router.get("/public", getSettings);

// Admin-only view of settings ✅
router.get("/", protect, adminProtect, getSettings);

// Update settings + logo upload ✅
router.put("/", protect, adminProtect, upload.single("logo"), updateSettings);

export default router;
