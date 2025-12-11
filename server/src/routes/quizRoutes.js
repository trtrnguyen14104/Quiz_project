import express from "express";
import { quizController } from "../controllers/quizController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", quizController.getAll);
router.get("/popular", quizController.getPopular);
router.get("/recent", quizController.getRecent);
router.get("/:id", quizController.getById);
router.get("/code/:code", quizController.getByCode);
router.get("/:id/full", quizController.getQuizWithQuestions);

// Protected routes
router.use(authenticate);

router.post("/", quizController.create);
router.post("/with-questions", quizController.createWithQuestions);
router.put("/:id", quizController.update);
router.delete("/:id", quizController.delete);
router.post("/:id/duplicate", quizController.duplicate);
router.post("/:id/publish", quizController.publish);

// Config routes
router.get("/:id/config", quizController.getConfig);
router.put("/:id/config", quizController.updateConfig);

export default router;