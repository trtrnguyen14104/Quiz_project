import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: "Quá nhiều lần đăng nhập, vui lòng thử lại sau 15 phút",
});