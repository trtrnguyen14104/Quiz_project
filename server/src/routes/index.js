import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import quizRoutes from "./quizRoutes.js";
import questionRoutes from "./questionRoutes.js";
import attemptRoutes from "./attemptRoutes.js";
import classRoutes from "./classRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import topicRoutes from "./topicRoutes.js";
import adminRoutes from "./adminRoutes.js";
import reportRoutes from "./reportRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import excelRoutes from "./excelRoutes.js";

const router = express.Router();

// API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/quizzes", quizRoutes);
router.use("/questions", questionRoutes);
router.use("/attempts", attemptRoutes);
router.use("/classes", classRoutes);
router.use("/categories", categoryRoutes);
router.use("/subjects", subjectRoutes);
router.use("/topics", topicRoutes);
router.use("/admin", adminRoutes);
router.use("/reports", reportRoutes);
router.use("/upload", uploadRoutes);
router.use("/excel", excelRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

export default router;