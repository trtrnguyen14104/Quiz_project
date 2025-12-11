import {UserModel} from "../models/User.js";
import {QuizModel} from "../models/Quiz.js";
import {ClassModel} from "../models/Class.js";
import {ClassMemberModel} from "../models/ClassMember.js";
import {QuizAttemptModel} from "../models/QuizAttempt.js";
import bcrypt from "bcrypt";
import {pool} from "../config/database.js";

export const userService = {
  async getProfile(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy người dùng",
        };
      }

      return {
        wasSuccessful: true,
        message: "Lấy thông tin thành công",
        result: user,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateProfile(userId, data) {
    try {
      const { user_name, avatar_url } = data;

      const updatedUser = await UserModel.update(userId, {
        user_name,
        avatar_url,
      });

      if (!updatedUser) {
        return {
          wasSuccessful: false,
          message: "Cập nhật thất bại",
        };
      }

      return {
        wasSuccessful: true,
        message: "Cập nhật thông tin thành công",
        result: updatedUser,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async changePassword(userId, data) {
    try {
      const { current_password, new_password } = data;

      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy người dùng",
        };
      }

      // Kiểm tra user có password không (đăng ký bằng Google thì không có)
      if (!user.password_hash || user.password_hash === "") {
        return {
          wasSuccessful: false,
          message: "Tài khoản này đăng nhập bằng Google, không thể đổi mật khẩu",
        };
      }

      // Kiểm tra mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
      if (!isValidPassword) {
        return {
          wasSuccessful: false,
          message: "Mật khẩu hiện tại không đúng",
        };
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Cập nhật mật khẩu
      await pool.query(
        "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
        [hashedPassword, userId]
      );

      return {
        wasSuccessful: true,
        message: "Đổi mật khẩu thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getMyQuizzes(userId) {
    try {
      const result = await QuizModel.findQuizByUserID(userId);
      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz thành công",
        result: result,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getMyClasses(userId) {
    try {
      const user = await UserModel.findById(userId);
      
      let classes;
      if (user.role === "teacher") {
        classes = await ClassModel.findByTeacher(userId);
      } else {
        const memberships = await ClassMemberModel.findByUser(userId);
        classes = memberships;
      }

      return {
        wasSuccessful: true,
        message: "Lấy danh sách lớp học thành công",
        result: classes,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getMyAttempts(userId, page = 1, limit = 10) {
    try {
      const result = await QuizAttemptModel.findByUserID(userId, page, limit);

      const countResult = await QuizAttemptModel.countAttemptsByUserId(userId);

      return {
        wasSuccessful: true,
        message: "Lấy lịch sử làm bài thành công",
        result: {
          attempts: result,
          total: countResult,
          page: parseInt(page),
          limit: parseInt(limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getStatistics(userId) {
    try {
      const stats = await QuizAttemptModel.getStatsByUserId(userId);

      const recentAttempts = await QuizAttemptModel.getRecentAttemptsByUserId(userId);

      return {
        wasSuccessful: true,
        message: "Lấy thống kê thành công",
        result: {
          statistics: stats,
          recent_attempts: recentAttempts,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};