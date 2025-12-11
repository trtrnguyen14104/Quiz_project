import { adminService } from "../services/adminService.js";

export const adminController = {
  async getDashboard(req, res) {
    try {
      const result = await adminService.getDashboard();
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, role, status } = req.query;
      const result = await adminService.getAllUsers({ page, limit, role, status });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.getUserById(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.updateUser(id, req.body);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteUser(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllQuizzes(req, res) {
    try {
      const { page = 1, limit = 20, status, subject_id } = req.query;
      const result = await adminService.getAllQuizzes({ page, limit, status, subject_id });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateQuizStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await adminService.updateQuizStatus(id, status);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteQuiz(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllClasses(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await adminService.getAllClasses({ page, limit });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getSystemLogs(req, res) {
    try {
      const { page = 1, limit = 50, action, user_id } = req.query;
      const result = await adminService.getSystemLogs({ page, limit, action, user_id });
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
      const { start_date, end_date } = req.query;
      const result = await adminService.getStatistics({ start_date, end_date });
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