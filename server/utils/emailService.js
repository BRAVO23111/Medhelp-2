import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send a confirmation email to the user
 * @param {string} to - Recipient email address
 * @param {string} username - Username of the recipient
 * @returns {Promise} - Promise that resolves when email is sent
 */
/**
 * Send a confirmation email to the user after Google OAuth authentication
 * @param {string} to - Recipient email address
 * @param {string} username - Username of the recipient
 * @param {boolean} isOAuth - Whether the user authenticated via OAuth
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendConfirmationEmail = async (to, username, isOAuth = false) => {
  try {
    const subject = isOAuth ? 'Welcome to MedHelp - Google Account Linked' : 'Welcome to MedHelp - Account Confirmation';
    const messageContent = isOAuth ?
      `Thank you for signing in with Google. Your Google account has been successfully linked with MedHelp.` :
      `Thank you for creating an account with MedHelp. Your account has been successfully created and is now ready to use.`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5;">Welcome to MedHelp!</h2>
          <p>Hello ${username},</p>
          <p>${messageContent}</p>
          <p>You can now book appointments with our healthcare professionals and manage your medical records.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.CLIENT_URL}/login" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
          </div>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The MedHelp Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};