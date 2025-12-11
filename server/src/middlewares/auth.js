// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Token không được cung cấp" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Người dùng không tồn tại" });
    }

    if (user.status !== "active") {
      return res.status(401).json({ error: "Tài khoản đã bị khóa" });
    }

    req.user = {
      id: user.user_id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token đã hết hạn" });
    }
    return res.status(401).json({ error: "Token không hợp lệ" });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Chưa xác thực" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }

    next();
  };
};