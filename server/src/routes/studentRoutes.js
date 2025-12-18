import express from "express";
import { studentController } from "../controllers/studentController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);
router.use(requireRole("student"));

router.get("/dashboard", studentController.getDashboard);
router.get("/quizzes", studentController.getQuizzes);
router.get("/results", studentController.getResults);
router.get("/classes", studentController.getClasses);
router.get("/classes/:classId/quizzes", studentController.getClassQuizzes);
router.get("/classes/:classId/students", studentController.getClassStudents);
router.get("/my-created-quizzes", studentController.getMyCreatedQuizzes);

export default router;
