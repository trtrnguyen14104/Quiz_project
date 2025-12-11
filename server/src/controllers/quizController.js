// controllers/quizController.js
import { quizService } from "../services/quizService.js";

export const quizController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 12, subject_id, difficulty_level, status, search } = req.query;
      const result = await quizService.getAll({ page, limit, subject_id, difficulty_level, status, search });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.getById(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getByCode(req, res) {
    try {
      const { code } = req.params;
      const result = await quizService.getByCode(code);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getQuizWithQuestions(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.getQuizWithQuestions(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async create(req, res) {
    try {
      const creatorId = req.user.id;
      const result = await quizService.create({ ...req.body, creator_id: creatorId });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createWithQuestions(req, res) {
    try {
      const creatorId = req.user.id;
      const result = await quizService.createWithQuestions({ ...req.body, creator_id: creatorId });
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.update(id, req.body);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.delete(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async duplicate(req, res) {
    try {
      const { id } = req.params;
      const creatorId = req.user.id;
      const result = await quizService.duplicate(id, creatorId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async publish(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.publish(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getConfig(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.getConfig(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateConfig(req, res) {
    try {
      const { id } = req.params;
      const result = await quizService.updateConfig(id, req.body);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;
      const result = await quizService.getPopular(limit);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getRecent(req, res) {
    try {
      const { limit = 10 } = req.query;
      const result = await quizService.getRecent(limit);
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