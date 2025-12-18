import { authController } from "../controllers/authController.js";
import {Router} from "express";
// import passport from "passport";

const router = Router();

// Email/Password Auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail); // ?token=xxx
router.post("/resend-verification", authController.resendVerification);

// // Google OAuth
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { 
//     failureRedirect: "/login",
//     session: false // Không dùng session, dùng JWT
//   }),
//   authController.googleCallback
// );

export default router;