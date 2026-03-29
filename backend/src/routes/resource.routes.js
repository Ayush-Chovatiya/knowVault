import express from "express";
import {
  addResource,
  getResource,
  getSingleResource,
  deleteResource,
  updateResource,
} from "../controllers/resource.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, addResource);
router.get("/", authMiddleware, getResource);
router.get("/:id", authMiddleware, getSingleResource);
router.delete("/:id", authMiddleware, deleteResource);
router.patch("/:id", authMiddleware, updateResource);

export default router;
