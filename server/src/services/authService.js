import { UserModel } from "../models/User.js";
import { EmailVerificationModel } from "../models/EmailVerification.js";
import { emailService } from "./emailService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const authService = {
    async register(data) {
        const {email, password, username, role} = data;
        const existedUser = await UserModel.findByEmail(email);
        if(existedUser) {
            console.error("Email đã tồn tại");
            return { wasSuccessful: false, message: "Email đã tồn tại" };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            user_name: username,
            email: email,
            password_hash: hashedPassword,
            role: role,
        });

        // Tạo verification token
        const verification = await EmailVerificationModel.create(newUser.user_id);

        // Gửi email xác thực
        const emailResult = await emailService.sendVerificationEmail(
            email,
            verification.token
        );
        
        if (!emailResult.success) {
            console.error("Không thể gửi email xác thực");
        }
        return {
        wasSuccessful: true,
        message: "Đăng ký thành công",
        result: newUser,
        };
    },
    async verifyEmail(token) {
        console.log("verifyEmail service đang được gọi");
        const verification = await EmailVerificationModel.findByToken(token);

        if (!verification) {
        return {
            wasSuccessful: false,
            message: "Token không hợp lệ hoặc đã hết hạn",
        };
        }

        // Cập nhật user is_verified = true

        await UserModel.update(verification.user_id, { is_verified: true });

        // Xóa token đã sử dụng
        await EmailVerificationModel.deleteByUserId(verification.user_id);

        return {
        wasSuccessful: true,
        message: "Xác thực email thành công",
        };
    },

    async resendVerification(email) {
        const user = await UserModel.findByEmail(email);

        if (!user) {
        return { wasSuccessful: false, message: "Email không tồn tại" };
        }

        if (user.is_verified) {
        return { wasSuccessful: false, message: "Email đã được xác thực" };
        }

        // Xóa token cũ
        await EmailVerificationModel.deleteByUserId(user.user_id);

        // Tạo token mới
        const verification = await EmailVerificationModel.create(user.user_id);

        // Gửi lại email
        await emailService.sendVerificationEmail(email, verification.token);

        return {
        wasSuccessful: true,
        message: "Đã gửi lại email xác thực",
        };
    },
    async login(data) {
        const {email, password} = data;
        const existedUser = await UserModel.findByEmail(email);
        if(!existedUser) {
            console.error("Không tìm thấy email");
            return { wasSuccessful: false, message: "Không tìm thấy email" };
        }
        if (existedUser.password_hash === "google") {
        return {
            wasSuccessful: false,
            message: "Tài khoản này đăng nhập bằng Google. Vui lòng sử dụng đăng nhập Google.",
        };
        }

        if (!existedUser.is_verified) {
        return {
            wasSuccessful: false,
            message: "Vui lòng xác thực email trước khi đăng nhập",
            needsVerification: true,
        };
        }
        const passwordCompared = await bcrypt.compare(password, existedUser.password_hash);
        if(!passwordCompared) {
            console.error("Mật khẩu không chính xác");
            return { wasSuccessful: false, message: "Mật khẩu không chính xác" };
        }
        const token = jwt.sign(
            {
                id: existedUser.user_id,
                email: existedUser.email,
                role: existedUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        return {
        wasSuccessful: true,
        message: "Đăng nhập thành công",
        token,
        existedUser,
        };
    },
    // Xử lý Google OAuth callback
  async handleGoogleCallback(user) {
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      wasSuccessful: true,
      message: "Đăng nhập Google thành công",
      token,
      user,
    };
  },
}
