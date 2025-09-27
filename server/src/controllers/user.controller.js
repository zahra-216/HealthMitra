// server/src/controllers/user.controller.js
const { User, HealthRecord } = require("../models");

// Get all users (admin/doctor only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      pagination: {
        current: parseInt(page, 10),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      req.user._id.toString() !== id &&
      !["doctor", "admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Get health records of a user
const getUserHealthRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, type } = req.query;
    const skip = (page - 1) * limit;

    let query;

    if (req.user._id.toString() === id) {
      // User accessing their own records
      query = { userId: id };
    } else if (req.user.role === "doctor") {
      // Doctor accessing patient records (only shared ones)
      query = {
        userId: id,
        $or: [{ "sharedWith.userId": req.user._id }, { isPrivate: false }],
      };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    if (type) {
      query.type = type;
    }

    const records = await HealthRecord.find(query)
      .populate("doctorId", "firstName lastName")
      .sort({ recordDate: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await HealthRecord.countDocuments(query);

    res.status(200).json({
      records,
      pagination: {
        current: parseInt(page, 10),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching health records",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserHealthRecords,
};
