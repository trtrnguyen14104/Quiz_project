import { transporter } from "../config/email.js";
import dotenv from "dotenv";
dotenv.config();
export const emailService = {
  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"Quiz App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác thực tài khoản",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Xác thực tài khoản của bạn</h2>
          <p>Cảm ơn bạn đã đăng ký! Vui lòng click vào link bên dưới để xác thực email:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                    color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Xác thực Email
          </a>
          <p>Hoặc copy link này vào trình duyệt:</p>
          <p style="color: #666;">${verificationUrl}</p>
          <p>Link này sẽ hết hạn sau 24 giờ.</p>
          <p style="color: #999; font-size: 12px;">Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    };
    
    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  },
};