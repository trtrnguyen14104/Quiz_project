import express from "express";
import { classController } from "../controllers/classController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/", classController.getAll);
router.get("/:id", classController.getById);
router.post("/join", classController.joinByCode);

router.post("/", authorize(["teacher", "admin"]), classController.create);
router.put("/:id", authorize(["teacher", "admin"]), classController.update);
router.delete("/:id", authorize(["teacher", "admin"]), classController.delete);

router.get("/:id/members", classController.getMembers);
router.delete("/:id/members/:memberId", authorize(["teacher", "admin"]), classController.removeMember);

router.get("/:id/quizzes", classController.getAssignedQuizzes);
router.post("/:id/quizzes", authorize(["teacher", "admin"]), classController.assignQuiz);
router.delete("/:id/quizzes/:classQuizId", authorize(["teacher", "admin"]), classController.removeQuiz);

export default router;