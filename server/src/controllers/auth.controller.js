// server/src/controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwt: jwtConfig } = require("../config");
const { smsService } = require("../services");

// -------- Helper functions --------
const generateToken = (userId) =>
  jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });

// -------- Controllers --------

// Register a new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Check duplicates
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email or phone" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || "patient",
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Send SMS notification (non-blocking, dummy in dev)
    if (phone) {
      smsService
        .sendSMS(
          phone,
          "Welcome to HealthMitra! Your account has been created successfully."
        )
        .catch((err) => console.error("SMS sending failed:", err.message));
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({
      message: "Login successful",
      user: userResponse,
      token,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Server error fetching profile",
      error: error.message,
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error updating profile",
      error: error.message,
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, jwtConfig.secret);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    return res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
};
