import express from "express";
import {
  registerUser,
  loginUser,
  currUser,
} from "../controllers/auth.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/me", authMiddleware, currUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
