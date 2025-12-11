import { uploadService } from "../services/uploadService.js";

export const uploadController = {
  async uploadAvatar(req, res) {
    try {
      const userId = req.user.id;
      const result = await uploadService.uploadAvatar(req.file, userId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async uploadQuizCover(req, res) {
    try {
      const { quizId } = req.params;
      const result = await uploadService.uploadQuizCover(req.file, quizId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async uploadQuestionImage(req, res) {
    try {
      const { questionId } = req.params;
      const result = await uploadService.uploadQuestionImage(req.file, questionId);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async uploadMultiple(req, res) {
    try {
      const result = await uploadService.uploadMultiple(req.files);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteFile(req, res) {
    try {
      const { filePath } = req.body;
      const result = await uploadService.deleteFile(filePath);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};