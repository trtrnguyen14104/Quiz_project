import { UserModel } from "../models/User.js";
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
        return {
        wasSuccessful: true,
        message: "Đăng ký thành công",
        result: newUser,
        };
    },
    async login(data) {
        const {email, password, username, role} = data;
        const existedUser = await UserModel.findByEmail(email);
        if(!existedUser) {
            console.error("Không tìm thấy email");
            return { wasSuccessful: false, message: "Không tìm thấy email" };
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
    }
}
