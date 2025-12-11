import { attemptService } from "../services/attemptService.js";

export const attemptController = {
  async start(req, res) {
    try {
      const { quizId } = req.params;
      const userId = req.user.id; // Từ JWT middleware
      
      const result = await attemptService.startAttempt(quizId, userId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async submitAnswer(req, res) {
    try {
      const { attemptId } = req.params;
      const result = await attemptService.submitAnswer(attemptId, req.body);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async finish(req, res) {
    try {
      const { attemptId } = req.params;
      const result = await attemptService.finishAttempt(attemptId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getResult(req, res) {
    try {
      const { attemptId } = req.params;
      const result = await attemptService.getResult(attemptId);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getMyAttempts(req, res) {
    try {
      const userId = req.user.id;
      const result = await attemptService.getUserAttempts(userId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getQuizAttempts(req, res) {
    try {
      const { quizId } = req.params;
      const result = await attemptService.getQuizAttempts(quizId);
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