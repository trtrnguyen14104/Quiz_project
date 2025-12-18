import { studentService } from "../services/studentService.js";

export const studentController = {
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const result = await studentService.getDashboard(userId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getQuizzes(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, status } = req.query;
      const result = await studentService.getQuizzes(userId, { page, limit, status });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getResults(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;
      const result = await studentService.getResults(userId, { page, limit });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getClasses(req, res) {
    try {
      const userId = req.user.id;
      const result = await studentService.getClasses(userId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getClassQuizzes(req, res) {
    try {
      const userId = req.user.id;
      const { classId } = req.params;
      const result = await studentService.getClassQuizzes(userId, classId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getClassStudents(req, res) {
    try {
      const userId = req.user.id;
      const { classId } = req.params;
      const result = await studentService.getClassStudents(userId, classId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getMyCreatedQuizzes(req, res) {
    try {
      const userId = req.user.id;
      const result = await studentService.getMyCreatedQuizzes(userId);
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
