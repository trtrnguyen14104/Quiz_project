import { authService } from "../services/authService.js";

export const authController = {
    async register (req, res) {
        try {
            console.log('Register req.body:', req.body);
            const {email, password, username, role} = req.body;
            console.log('Extracted values:', {email, password: '***', username, role}); // Debug log
            const result = await authService.register({email, password, username, role});
            if(!result.wasSuccessful) {
                return res.status(400).json(result);
            }
            return res.status(201).json(result);
        } catch (error) {
            console.error("Lỗi server", error);
            return res.status(500).json({wasSuccessful: false, message: "Lỗi server"});
        }
    },
    async login(req, res) {
        try {
            const {email, password} = req.body;
            const result = await authService.login({email, password});
            if(!result.wasSuccessful) {
                return res.status(401).json(result);
            }
            return res.status(200).json(result); 
        } catch (error) {
            console.error("Lỗi server", error);
            return res.status(500).json({wasSuccessful: false, message: "Lỗi server"});
        }
    },
    async verifyEmail(req, res) {
        console.log("verifyEmail controller đang được gọi");
    try {
      const { token } = req.query;
      const result = await authService.verifyEmail(token);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  async resendVerification(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.resendVerification(email);
      
      if (!result.wasSuccessful) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi server" });
    }
  },
  // Google OAuth callback
  async googleCallback(req, res) {
    try {
      const result = await authService.handleGoogleCallback(req.user);
      
      // Redirect về frontend với token
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(`${frontendUrl}/auth/google/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`);
    } catch (error) {
      console.error(error);
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(`${frontendUrl}/auth/error?message=Login failed`);
    }
  },
}