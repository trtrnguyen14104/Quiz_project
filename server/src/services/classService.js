import { ClassModel } from "../models/Class.js";
import { ClassMemberModel } from "../models/ClassMember.js";
import { ClassQuizModel } from "../models/ClassQuiz.js";
import { QuizModel } from "../models/Quiz.js";
import crypto from "crypto";

export const classService = {
  async getAll() {
    try {
      const classes = await ClassModel.findAll();
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

  async getById(classId) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const memberCount = await ClassMemberModel.countByClass(classId);

      return {
        wasSuccessful: true,
        message: "Lấy thông tin lớp học thành công",
        result: {
          ...classData,
          member_count: memberCount,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const { class_name, description, subject_id, teacher_id } = data;

      // Tạo class code ngẫu nhiên 6 ký tự
      const class_code = crypto.randomBytes(3).toString("hex").toUpperCase();

      const newClass = await ClassModel.create({
        class_name,
        description,
        class_code,
        subject_id,
        teacher_id,
      });

      return {
        wasSuccessful: true,
        message: "Tạo lớp học thành công",
        result: newClass,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async update(classId, data) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const updatedClass = await ClassModel.update(classId, data);

      return {
        wasSuccessful: true,
        message: "Cập nhật lớp học thành công",
        result: updatedClass,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete(classId) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      await ClassModel.softDelete(classId);

      return {
        wasSuccessful: true,
        message: "Xóa lớp học thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async joinByCode(userId, classCode) {
    try {
      const classData = await ClassModel.findByCode(classCode);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Mã lớp học không hợp lệ",
        };
      }

      // Kiểm tra đã tham gia chưa
      const existingMember = await ClassMemberModel.findByClassAndUser(classData.class_id, userId);
      if (existingMember) {
        return {
          wasSuccessful: false,
          message: "Bạn đã tham gia lớp học này rồi",
        };
      }

      const member = await ClassMemberModel.create({
        class_id: classData.class_id,
        user_id: userId,
      });

      return {
        wasSuccessful: true,
        message: "Tham gia lớp học thành công",
        result: {
          ...member,
          class_name: classData.class_name,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getMembers(classId) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const members = await ClassMemberModel.findByClass(classId);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách thành viên thành công",
        result: members,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async removeMember(classId, memberId) {
    try {
      const member = await ClassMemberModel.findById(memberId);
      if (!member || member.class_id !== parseInt(classId)) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy thành viên",
        };
      }

      await ClassMemberModel.delete(memberId);

      return {
        wasSuccessful: true,
        message: "Xóa thành viên thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async assignQuiz(classId, quizId, dueDate) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz",
        };
      }

      // Kiểm tra đã gán chưa
      const existing = await ClassQuizModel.findByClassAndQuiz(classId, quizId);
      if (existing) {
        return {
          wasSuccessful: false,
          message: "Quiz đã được gán cho lớp này rồi",
        };
      }

      const classQuiz = await ClassQuizModel.create({
        class_id: classId,
        quiz_id: quizId,
        due_date: dueDate,
      });

      return {
        wasSuccessful: true,
        message: "Gán quiz cho lớp thành công",
        result: classQuiz,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAssignedQuizzes(classId) {
    try {
      const classData = await ClassModel.findById(classId);
      if (!classData) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy lớp học",
        };
      }

      const quizzes = await ClassQuizModel.findByClass(classId);

      return {
        wasSuccessful: true,
        message: "Lấy danh sách quiz thành công",
        result: quizzes,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async removeQuiz(classId, classQuizId) {
    try {
      const classQuiz = await ClassQuizModel.findById(classQuizId);
      if (!classQuiz || classQuiz.class_id !== parseInt(classId)) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy quiz assignment",
        };
      }

      await ClassQuizModel.delete(classQuizId);

      return {
        wasSuccessful: true,
        message: "Xóa quiz khỏi lớp thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};