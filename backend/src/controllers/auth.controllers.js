import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import { ZodError } from "zod";
import { sendOTPEmail } from "../utils/email.js";

const registerUser = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password } = validatedData;

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ message: "username already taken!!" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten().fieldErrors;
      return res.status(400).json({ message: formatted });
    }

    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!!" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res.status(400).json({ message: "Incorrect password!!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Succesful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten().fieldErrors;
      return res.status(400).json({ message: formatted });
    }

    res.status(500).json({ message: error.message });
  }
};

const currUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If an account exists with this email, you will receive an OTP.",
      });
    }

    const otp = user.generateOTP();
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({
      message: "If an account exists with this email, you will receive an OTP.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten().fieldErrors;
      return res.status(400).json({ message: formatted });
    }

    res.status(500).json({ message: "Error sending OTP. Please try again." });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = verifyOTPSchema.parse(req.body);

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully", verified: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten().fieldErrors;
      return res.status(400).json({ message: formatted });
    }

    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = resetPasswordSchema.parse(req.body);

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now login with your new password." });
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.flatten().fieldErrors;
      return res.status(400).json({ message: formatted });
    }

    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, currUser, forgotPassword, verifyOTP, resetPassword };
