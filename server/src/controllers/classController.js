// controllers/classController.js
import { classService } from "../services/classService.js";

export const classController = {
  async getAll(req, res) {
    try {
      const result = await classService.getAll();
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
      const result = await classService.getById(id);
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
      const teacherId = req.user.id;
      const result = await classService.create({ ...req.body, teacher_id: teacherId });
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
      const result = await classService.update(id, req.body);
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
      const result = await classService.delete(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async joinByCode(req, res) {
    try {
      const userId = req.user.id;
      const { class_code } = req.body;
      const result = await classService.joinByCode(userId, class_code);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getMembers(req, res) {
    try {
      const { id } = req.params;
      const result = await classService.getMembers(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async removeMember(req, res) {
    try {
      const { id, memberId } = req.params;
      const result = await classService.removeMember(id, memberId);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async assignQuiz(req, res) {
    try {
      const { id } = req.params;
      const { quiz_id, due_date } = req.body;
      const result = await classService.assignQuiz(id, quiz_id, due_date);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAssignedQuizzes(req, res) {
    try {
      const { id } = req.params;
      const result = await classService.getAssignedQuizzes(id);
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async removeQuiz(req, res) {
    try {
      const { id, classQuizId } = req.params;
      const result = await classService.removeQuiz(id, classQuizId);
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