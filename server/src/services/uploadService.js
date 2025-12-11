import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "../uploads");
const avatarDir = path.join(uploadDir, "avatars");
const quizImagesDir = path.join(uploadDir, "quiz-images");
const questionImagesDir = path.join(uploadDir, "question-images");

[uploadDir, avatarDir, quizImagesDir, questionImagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Cấu hình storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = uploadDir;
    
    if (req.path.includes("/avatar")) {
      folder = avatarDir;
    } else if (req.path.includes("/quiz-cover")) {
      folder = quizImagesDir;
    } else if (req.path.includes("/question-image")) {
      folder = questionImagesDir;
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)"));
  }
};

// Multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

export const uploadService = {
  // Xử lý upload avatar
  async uploadAvatar(file, userId) {
    try {
      if (!file) {
        return {
          wasSuccessful: false,
          message: "Không có file được upload",
        };
      }

      const fileUrl = `/uploads/avatars/${file.filename}`;

      return {
        wasSuccessful: true,
        message: "Upload avatar thành công",
        result: {
          url: fileUrl,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Xử lý upload quiz cover
  async uploadQuizCover(file, quizId) {
    try {
      if (!file) {
        return {
          wasSuccessful: false,
          message: "Không có file được upload",
        };
      }

      const fileUrl = `/uploads/quiz-images/${file.filename}`;

      return {
        wasSuccessful: true,
        message: "Upload quiz cover thành công",
        result: {
          url: fileUrl,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Xử lý upload question image
  async uploadQuestionImage(file, questionId) {
    try {
      if (!file) {
        return {
          wasSuccessful: false,
          message: "Không có file được upload",
        };
      }

      const fileUrl = `/uploads/question-images/${file.filename}`;

      return {
        wasSuccessful: true,
        message: "Upload question image thành công",
        result: {
          url: fileUrl,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Upload multiple files
  async uploadMultiple(files) {
    try {
      if (!files || files.length === 0) {
        return {
          wasSuccessful: false,
          message: "Không có file được upload",
        };
      }

      const uploadedFiles = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      }));

      return {
        wasSuccessful: true,
        message: `Upload ${files.length} file thành công`,
        result: uploadedFiles,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Xóa file
  async deleteFile(filePath) {
    try {
      const fullPath = path.join(__dirname, "..", filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return {
          wasSuccessful: true,
          message: "Xóa file thành công",
        };
      } else {
        return {
          wasSuccessful: false,
          message: "File không tồn tại",
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Lấy thông tin file
  getFileInfo(filePath) {
    try {
      const fullPath = path.join(__dirname, "..", filePath);

      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        return {
          wasSuccessful: true,
          result: {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          },
        };
      } else {
        return {
          wasSuccessful: false,
          message: "File không tồn tại",
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};