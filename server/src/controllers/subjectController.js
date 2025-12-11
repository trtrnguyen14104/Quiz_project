import { subjectService } from "../services/subjectService.js";

export const subjectController = {
  async getAll(req, res) {
    try {
      const result = await subjectService.getAll();
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
      const result = await subjectService.getById(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getTopics(req, res) {
    try {
      const { id } = req.params;
      const result = await subjectService.getTopics(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getQuizzes(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 12 } = req.query;
      const result = await subjectService.getQuizzes(id, { page, limit });
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getClasses(req, res) {
    try {
      const { id } = req.params;
      const result = await subjectService.getClasses(id);
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
      const result = await subjectService.create(req.body);
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
      const result = await subjectService.update(id, req.body);
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
      const result = await subjectService.delete(id);
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
      const { id } = req.params;
      const result = await subjectService.getStatistics(id);
      if (!result.wasSuccessful) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};