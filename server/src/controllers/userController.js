import { userService } from "../services/userService.js";

export const userController = {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const result = await userService.getProfile(userId);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const result = await userService.updateProfile(userId, req.body);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const result = await userService.changePassword(userId, req.body);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getMyQuizzes(req, res) {
    try {
      const userId = req.user.id;
      const result = await userService.getMyQuizzes(userId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getMyClasses(req, res) {
    try {
      const userId = req.user.id;
      const result = await userService.getMyClasses(userId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
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
      const { page = 1, limit = 10 } = req.query;
      const result = await userService.getMyAttempts(userId, page, limit);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getStatistics(req, res) {
    try {
      const userId = req.user.id;
      const result = await userService.getStatistics(userId);
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