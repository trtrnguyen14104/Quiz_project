import express from "express";
import { questionController } from "../controllers/questionController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/quiz/:quizId", questionController.getByQuiz);
router.get("/:id", questionController.getById);
router.post("/", questionController.create);
router.post("/quiz/:quizId/bulk", questionController.createBulk);
router.put("/:id", questionController.update);
router.delete("/:id", questionController.delete);

export default router;