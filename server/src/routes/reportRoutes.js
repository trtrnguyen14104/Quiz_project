import express from "express";
import { reportController } from "../controllers/reportController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// Quiz reports (for creator/teacher)
router.get("/quiz/:quizId", reportController.getQuizReport);

// Class reports (for teacher)
router.get("/class/:classId", authorize(["teacher", "admin"]), reportController.getClassReport);

// User reports (own reports)
router.get("/user", reportController.getUserReport);

// Compare students (for teacher)
router.post("/class/:classId/compare", authorize(["teacher", "admin"]), reportController.compareStudents);

export default router;