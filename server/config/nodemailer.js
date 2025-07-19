import nodemailer from "nodemailer";
import {EMAIL_USER, EMAIL_PASSWORD} from "./env.js";

// Create transporter (this will be reused)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Reusable email sending function
const sendEmail = async ({to, subject, text, html, from}) => {
  try {
    const mailOptions = {
      from: from || EMAIL_USER,
      to,
      subject,
      text,
      html, // optional HTML content
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      info,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Enhanced OTP email templates
const getOTPEmailTemplate = (otp, type, userEmail) => {
  const templates = {
    register: {
      subject: "Welcome to FastLink - Verify Your Email",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🚀 Welcome to FastLink!</h1>
              <p>Complete your registration with the verification code below</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Thank you for joining FastLink. To complete your registration, please use the verification code below:</p>
              
              <div class="otp-box">
                <p>Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>Valid for 10 minutes</small></p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. FastLink will never ask for your verification code via phone or email.
              </div>
              
              <p>If you didn't request this verification, please ignore this email.</p>
              
              <div class="footer">
                <p>Best regards,<br>The FastLink Team</p>
                <p><small>This is an automated message, please do not reply.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to FastLink!\n\nYour verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request this verification, please ignore this email.\n\nBest regards,\nThe FastLink Team`,
    },
    login: {
      subject: "FastLink - Your Login Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🔐 FastLink Login</h1>
              <p>Secure access to your account</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Someone requested to sign in to your FastLink account (<strong>${userEmail}</strong>). Use the verification code below to continue:</p>
              
              <div class="otp-box">
                <p>Your login verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>Valid for 10 minutes</small></p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this login, someone may be trying to access your account. Please secure your account immediately.
              </div>
              
              <div class="footer">
                <p>Best regards,<br>The FastLink Team</p>
                <p><small>This is an automated message, please do not reply.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `FastLink Login Verification\n\nSomeone requested to sign in to your FastLink account (${userEmail}).\n\nYour verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request this login, someone may be trying to access your account.\n\nBest regards,\nThe FastLink Team`,
    },
    password_reset: {
      subject: "FastLink - Password Reset Verification",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #e74c3c; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #e74c3c; letter-spacing: 8px; margin: 10px 0; }
            .warning { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🔄 Password Reset</h1>
              <p>Reset your FastLink account password</p>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset the password for your FastLink account (<strong>${userEmail}</strong>). Use the verification code below:</p>
              
              <div class="otp-box">
                <p>Your password reset code is:</p>
                <div class="otp-code">${otp}</div>
                <p><small>Valid for 10 minutes</small></p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> If you didn't request a password reset, please ignore this email and consider securing your account.
              </div>
              
              <div class="footer">
                <p>Best regards,<br>The FastLink Team</p>
                <p><small>This is an automated message, please do not reply.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `FastLink Password Reset\n\nWe received a request to reset the password for your FastLink account (${userEmail}).\n\nYour password reset code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request a password reset, please ignore this email.\n\nBest regards,\nThe FastLink Team`,
    },
  };

  return templates[type] || templates.login;
};

// Convenience functions for OTP emails
const sendOTPEmail = async (userEmail, otp, type = "login") => {
  const template = getOTPEmailTemplate(otp, type, userEmail);

  return await sendEmail({
    to: userEmail,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

const sendLoginOTP = async (userEmail, otp) => {
  return await sendOTPEmail(userEmail, otp, "login");
};

const sendRegistrationOTP = async (userEmail, otp) => {
  return await sendOTPEmail(userEmail, otp, "register");
};

const sendPasswordResetOTP = async (userEmail, otp) => {
  return await sendOTPEmail(userEmail, otp, "password_reset");
};

// Legacy functions (keeping for backward compatibility)
const sendWelcomeEmail = async (userEmail, userName) => {
  return await sendEmail({
    to: userEmail,
    subject: "Welcome to FastLink!",
    text: `Hello ${userName}, welcome to our platform!`,
    html: `<h1>Hello ${userName}</h1><p>Welcome to our platform!</p>`,
  });
};

const sendPasswordResetEmail = async (userEmail, resetToken) => {
  return await sendEmail({
    to: userEmail,
    subject: "Password Reset Request",
    text: `Your password reset token is: ${resetToken}`,
    html: `<p>Your password reset token is: <strong>${resetToken}</strong></p>`,
  });
};

export {
  sendEmail,
  sendOTPEmail,
  sendLoginOTP,
  sendRegistrationOTP,
  sendPasswordResetOTP,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
