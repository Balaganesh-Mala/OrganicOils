import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/avatarUpload.middleware.js";
import {
  getMyProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put(
  "/me",
  protect,
  upload.single("avatar"), 
  updateProfile
);

router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);
router.patch("/address/:addressId/default", protect, setDefaultAddress);

export default router;
