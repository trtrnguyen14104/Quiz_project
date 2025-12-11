import express from "express";
import { attemptController } from "../controllers/attemptController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// Start quiz attempt
router.post("/quiz/:quizId/start", attemptController.start);

// Submit answer
router.post("/:attemptId/answer", attemptController.submitAnswer);

// Finish attempt
router.post("/:attemptId/finish", attemptController.finish);

// Get result
router.get("/:attemptId/result", attemptController.getResult);

// Get my attempts
router.get("/my-attempts", attemptController.getMyAttempts);

// Get quiz attempts (for teacher/creator)
router.get("/quiz/:quizId", attemptController.getQuizAttempts);

export default router;