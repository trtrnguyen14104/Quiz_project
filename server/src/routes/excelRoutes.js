import express from "express";
import { excelController, excelUpload } from "../controllers/excelController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// Import quiz from Excel
router.post("/import", excelUpload.single("file"), excelController.importQuiz);

// Export quiz to Excel
router.get("/export/quiz/:quizId", excelController.exportQuiz);

// Export quiz results
router.get("/export/quiz/:quizId/results", excelController.exportQuizResults);

// Export class students
router.get("/export/class/:classId/students", excelController.exportClassStudents);

// Download template
router.get("/template", excelController.downloadTemplate);

export default router;