import express from "express";
import { classController } from "../controllers/classController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// Public class routes
router.get("/", classController.getAll);
router.get("/:id", classController.getById);

// Join class by code (for students)
router.post("/join", classController.joinByCode);

// Teacher only routes
router.post("/", authorize(["teacher", "admin"]), classController.create);
router.put("/:id", authorize(["teacher", "admin"]), classController.update);
router.delete("/:id", authorize(["teacher", "admin"]), classController.delete);

// Member management
router.get("/:id/members", classController.getMembers);
router.delete("/:id/members/:memberId", authorize(["teacher", "admin"]), classController.removeMember);

// Quiz assignment
router.get("/:id/quizzes", classController.getAssignedQuizzes);
router.post("/:id/quizzes", authorize(["teacher", "admin"]), classController.assignQuiz);
router.delete("/:id/quizzes/:classQuizId", authorize(["teacher", "admin"]), classController.removeQuiz);

export default router;