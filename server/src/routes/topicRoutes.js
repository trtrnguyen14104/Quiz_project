import express from "express";
import { topicController } from "../controllers/topicController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", topicController.getAll);
router.get("/:id", topicController.getById);
router.get("/subject/:subjectId", topicController.getBySubject);

// Admin only routes
router.use(authenticate);
router.use(authorize(["admin"]));

router.post("/", topicController.create);
router.put("/:id", topicController.update);
router.delete("/:id", topicController.delete);

export default router;