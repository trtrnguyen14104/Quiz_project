import express from "express";
import { adminController } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(["admin"]));

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// User management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Quiz management
router.get("/quizzes", adminController.getAllQuizzes);
router.put("/quizzes/:id/status", adminController.updateQuizStatus);
router.delete("/quizzes/:id", adminController.deleteQuiz);

// Class management
router.get("/classes", adminController.getAllClasses);

// System logs
router.get("/logs", adminController.getSystemLogs);

// Statistics
router.get("/statistics", adminController.getStatistics);

export default router;