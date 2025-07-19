import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -pin");

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -pin");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -pin");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: {
        ...user.toObject(),
        hasCompletedProfile: user.hasCompletedProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===== PROFILE COMPLETION =====

export const completeProfile = async (req, res, next) => {
  try {
    const {name, password, pin} = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!name || !password || !pin) {
      const error = new Error("Name, password, and PIN are required");
      error.statusCode = 400;
      return next(error);
    }

    // Validate password length
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters long");
      error.statusCode = 400;
      return next(error);
    }

    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(pin)) {
      const error = new Error("PIN must be 4-6 digits");
      error.statusCode = 400;
      return next(error);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!user.isVerified) {
      const error = new Error(
        "Email must be verified before completing profile"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Hash password and PIN
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    const hashedPin = await bcryptjs.hash(pin, saltRounds);

    // Update user profile
    user.name = name.trim();
    user.password = hashedPassword;
    user.pin = hashedPin;
    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasCompletedProfile: user.hasCompletedProfile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {name} = req.body;
    const userId = req.user.userId;

    if (!name) {
      const error = new Error("Name is required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    user.name = name.trim();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasCompletedProfile: user.hasCompletedProfile,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const {oldPassword, newPassword} = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      const error = new Error(
        "Both old password and new password are required"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Validate new password length
    if (newPassword.length < 6) {
      const error = new Error(
        "New password must be at least 6 characters long"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!user.password) {
      const error = new Error("Please complete your profile first");
      error.statusCode = 400;
      return next(error);
    }

    // Verify old password
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      return next(error);
    }

    // Check if new password is different
    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      const error = new Error(
        "New password must be different from the old password"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Hash and update password
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePin = async (req, res, next) => {
  try {
    const {oldPin, newPin} = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!oldPin || !newPin) {
      const error = new Error("Both old PIN and new PIN are required");
      error.statusCode = 400;
      return next(error);
    }

    // Validate new PIN format
    if (!/^\d{4,6}$/.test(newPin)) {
      const error = new Error("PIN must be 4-6 digits");
      error.statusCode = 400;
      return next(error);
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!user.pin) {
      const error = new Error("Please complete your profile first");
      error.statusCode = 400;
      return next(error);
    }

    // Verify old PIN
    const isMatch = await bcryptjs.compare(oldPin, user.pin);
    if (!isMatch) {
      const error = new Error("Old PIN is incorrect");
      error.statusCode = 400;
      return next(error);
    }

    // Check if new PIN is different
    const isSamePin = await bcryptjs.compare(newPin, user.pin);
    if (isSamePin) {
      const error = new Error("New PIN must be different from the old PIN");
      error.statusCode = 400;
      return next(error);
    }

    // Hash and update PIN
    const saltRounds = 12;
    const hashedPin = await bcryptjs.hash(newPin, saltRounds);
    user.pin = hashedPin;
    await user.save();

    res.status(200).json({
      success: true,
      message: "PIN updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Only allow updating certain fields
    const allowedUpdates = ["name"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      const error = new Error("No valid updates provided");
      error.statusCode = 400;
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -pin");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
