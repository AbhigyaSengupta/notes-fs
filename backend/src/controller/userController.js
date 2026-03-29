import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sessionSchema from "../models/sessionSchema.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await userSchema.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false, 
        message: "Email already in use",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      name,
      email,
      password: hashedPass,
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: "User successfully registered",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      return res.status(403).json({
        success: false,
        message: "Invalid Password",
      });
    }

    await sessionSchema.findOneAndDelete({ userId: user._id });
    await sessionSchema.create({ userId: user._id });

    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "7d",
    });

    user.isLoggedIN = true;
    user.token = token; 
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      token, 
      user: {
        name: user.name, 
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const existing = await sessionSchema.findOne({ userId: req.userId });
    const user = await userSchema.findById({ _id: req.userId });

    if (existing) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      user.isLoggedIN = false;
      user.token = null; 
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Session successfully ended",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User had no session",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
