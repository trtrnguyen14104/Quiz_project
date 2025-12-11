import express from "express";
import { subjectController } from "../controllers/subjectController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", subjectController.getAll);
router.get("/:id", subjectController.getById);
router.get("/:id/topics", subjectController.getTopics);
router.get("/:id/quizzes", subjectController.getQuizzes);
router.get("/:id/classes", subjectController.getClasses);
router.get("/:id/statistics", subjectController.getStatistics);

// Admin only routes
router.use(authenticate);
router.use(authorize(["admin"]));

router.post("/", subjectController.create);
router.put("/:id", subjectController.update);
router.delete("/:id", subjectController.delete);

export default router;