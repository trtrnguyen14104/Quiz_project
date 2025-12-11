import { reportService } from "../services/reportService.js";

export const reportController = {
  async getQuizReport(req, res) {
    try {
      const { quizId } = req.params;
      const result = await reportService.getQuizReport(quizId);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getClassReport(req, res) {
    try {
      const { classId } = req.params;
      const result = await reportService.getClassReport(classId);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getUserReport(req, res) {
    try {
      const userId = req.user.id;
      const result = await reportService.getUserReport(userId);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async compareStudents(req, res) {
    try {
      const { classId } = req.params;
      const { studentIds } = req.body;
      
      if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ error: "studentIds phải là mảng không rỗng" });
      }

      const result = await reportService.compareStudents(classId, studentIds);
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