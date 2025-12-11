import { categoryService } from "../services/categoryService.js";

export const categoryController = {
  async getAll(req, res) {
    try {
      const result = await categoryService.getAll();
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
      const result = await categoryService.getById(id);
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
      const result = await categoryService.create(req.body);
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
      const result = await categoryService.update(id, req.body);
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
      const result = await categoryService.delete(id);
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