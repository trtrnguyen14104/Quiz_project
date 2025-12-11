import { excelService } from "../services/excelService.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/temp/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const excelUpload = multer({ storage: storage });

export const excelController = {
  async importQuiz(req, res) {
    try {
      const userId = req.user.id;
      const result = await excelService.importQuizFromExcel(req.file, userId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async exportQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const result = await excelService.exportQuizToExcel(quizId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${result.result.filename}`
      );
      
      res.send(result.result.buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async exportQuizResults(req, res) {
    try {
      const { quizId } = req.params;
      const result = await excelService.exportQuizResultsToExcel(quizId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${result.result.filename}`
      );
      
      res.send(result.result.buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async exportClassStudents(req, res) {
    try {
      const { classId } = req.params;
      const result = await excelService.exportClassStudentsToExcel(classId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${result.result.filename}`
      );
      
      res.send(result.result.buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async downloadTemplate(req, res) {
    try {
      const result = await excelService.generateQuizTemplate();
      
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${result.result.filename}`
      );
      
      res.send(result.result.buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};