import { authController } from "../controllers/authController.js";
import {Router} from "express";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

export default router;