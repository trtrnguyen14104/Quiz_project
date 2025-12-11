// routes/category.routes.js
import express from "express";
import { categoryController } from "../controllers/categoryController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

// Admin only routes
router.use(authenticate);
router.use(authorize(["admin"]));

router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export default router;