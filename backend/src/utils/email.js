import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"KnowVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - KnowVault",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset OTP</h2>
        <p>You requested a password reset for your KnowVault account.</p>
        <p>Your OTP code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff;">${otp}</span>
        </div>
        <p>This code is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await getTransporter().sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw error;
  }
};
