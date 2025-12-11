import express from "express";
import { uploadController } from "../controllers/uploadController.js";
import { upload } from "../services/uploadService.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// Avatar upload
router.post("/avatar", upload.single("avatar"), uploadController.uploadAvatar);

// Quiz cover upload
router.post("/quiz-cover/:quizId", upload.single("cover"), uploadController.uploadQuizCover);

// Question image upload
router.post("/question-image/:questionId", upload.single("image"), uploadController.uploadQuestionImage);

// Multiple files upload
router.post("/multiple", upload.array("files", 10), uploadController.uploadMultiple);

// Delete file
router.delete("/file", uploadController.deleteFile);

export default router;