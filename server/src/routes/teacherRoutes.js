import express from "express";
import { teacherController } from "../controllers/teacherController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication and teacher role
router.use(authenticate);
router.use(requireRole("teacher"));

// Dashboard
router.get("/dashboard", teacherController.getDashboard);

// Classes
router.get("/classes", teacherController.getClasses);

// Quizzes
router.get("/quizzes", teacherController.getQuizzes);

// Statistics
router.get("/statistics", teacherController.getStatistics);

export default router;
