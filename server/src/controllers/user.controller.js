// server/src/controllers/user.controller.js
const { User, HealthRecord } = require("../models");
const { roleMiddleware } = require("../middleware/auth.middleware");

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
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    // Users can access their own data, doctors can access patient data
    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "doctor" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching user",
      error: error.message,
    });
  }
};

const getUserHealthRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (page - 1) * limit;

    let query;
    if (req.user._id.toString() === req.params.id) {
      // User accessing their own records
      query = { userId: req.params.id };
    } else if (req.user.role === "doctor") {
      // Doctor accessing patient records (only shared ones)
      query = {
        userId: req.params.id,
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
      .limit(parseInt(limit));

    const total = await HealthRecord.countDocuments(query);

    res.json({
      records,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching health records",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserHealthRecords,
};
