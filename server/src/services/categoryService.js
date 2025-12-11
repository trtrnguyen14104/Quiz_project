import { QuizCategoryModel } from "../models/QuizCategory.js";

export const categoryService = {
  async getAll() {
    try {
      const categories = await QuizCategoryModel.findAll();
      return {
        wasSuccessful: true,
        message: "Lấy danh sách category thành công",
        result: categories,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getById(categoryId) {
    try {
      const category = await QuizCategoryModel.findById(categoryId);
      if (!category) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy category",
        };
      }
      
      const quizCount = await QuizCategoryModel.countQuizzes(categoryId);
      
      return {
        wasSuccessful: true,
        message: "Lấy thông tin category thành công",
        result: { ...category, quiz_count: quizCount },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const { category_name, description } = data;

      // Kiểm tra tên category đã tồn tại
      const existingCategory = await QuizCategoryModel.findByName(category_name);
      if (existingCategory) {
        return {
          wasSuccessful: false,
          message: "Tên category đã tồn tại",
        };
      }

      const newCategory = await QuizCategoryModel.create({
        category_name,
        description,
      });

      return {
        wasSuccessful: true,
        message: "Tạo category thành công",
        result: newCategory,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async update(categoryId, data) {
    try {
      const category = await QuizCategoryModel.findById(categoryId);
      if (!category) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy category",
        };
      }

      const updatedCategory = await QuizCategoryModel.update(categoryId, data);
      
      return {
        wasSuccessful: true,
        message: "Cập nhật category thành công",
        result: updatedCategory,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async delete(categoryId) {
    try {
      const category = await QuizCategoryModel.findById(categoryId);
      if (!category) {
        return {
          wasSuccessful: false,
          message: "Không tìm thấy category",
        };
      }

      // Kiểm tra xem có quiz nào đang dùng category này không
      const quizCount = await QuizCategoryModel.countQuizzes(categoryId);
      if (quizCount > 0) {
        return {
          wasSuccessful: false,
          message: `Không thể xóa category. Có ${quizCount} quiz đang sử dụng category này.`,
        };
      }

      await QuizCategoryModel.softDelete(categoryId);

      return {
        wasSuccessful: true,
        message: "Xóa category thành công",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};