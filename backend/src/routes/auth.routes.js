import express from "express";
import {
  registerUser,
  loginUser,
  currUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/me", authMiddleware, currUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
