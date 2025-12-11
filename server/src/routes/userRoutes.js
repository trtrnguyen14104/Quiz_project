import express from "express";
import { userController } from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.post("/change-password", userController.changePassword);
router.get("/my-quizzes", userController.getMyQuizzes);
router.get("/my-classes", userController.getMyClasses);
router.get("/my-attempts", userController.getMyAttempts);
router.get("/statistics", userController.getStatistics);

export default router;