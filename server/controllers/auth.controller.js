import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "../config/env.js";

// ===== REGISTRATION FLOW =====

// Step 1: Send OTP for registration
export const sendRegistrationOTP = async (req, res, next) => {
  try {
    const {email} = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({email: email});
    if (existingUser && existingUser.isVerified) {
      const error = new Error("User already exists. Please sign in instead.");
      error.statusCode = 409;
      return next(error);
    }

    // Generate and save OTP
    const otpRecord = await OTP.createOTP(email, "register");

    // Send OTP email
    // const emailResult = await sendRegistrationOTPEmail(email, otpRecord.otp);
    //
    // if (!emailResult.success) {
    //   const error = new Error("Failed to send verification email");
    //   error.statusCode = 500;
    //   return next(error);
    // }

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      email: email,
    });
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify OTP and complete registration
export const verifyRegistrationOTP = async (req, res, next) => {
  try {
    const {email, otp} = req.body;

    if (!email || !otp) {
      const error = new Error("Email and OTP are required");
      error.statusCode = 400;
      return next(error);
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: email,
      type: "register",
      isUsed: false,
    }).sort({createdAt: -1});

    if (!otpRecord) {
      const error = new Error("Invalid or expired verification code");
      error.statusCode = 400;
      await otpRecord.deleteOne();
      return next(error);
    }

    // Verify OTP
    try {
      otpRecord.verifyOTP(otp);
      await otpRecord.save();
    } catch (otpError) {
      const error = new Error(otpError.message);
      error.statusCode = 400;
      return next(error);
    }

    // Check if user already exists (might be unverified)
    let user = await User.findOne({email: email});

    if (user) {
      // Update existing unverified user
      user.isVerified = true;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        email: email,
        isVerified: true,
      });
    }

    await otpRecord.deleteOne();

    // Generate tokens
    const accessToken = jwt.sign({userId: user._id}, JWT_SECRET || "secret", {
      expiresIn: JWT_EXPIRES_IN || "1h",
    });

    const refreshToken = jwt.sign(
      {userId: user._id},
      REFRESH_TOKEN_SECRET || "refresh_secret",
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN || "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===== LOGIN FLOW =====

// Step 1: Send OTP for login
export const sendLoginOTP = async (req, res, next) => {
  try {
    const {email} = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if user exists and is verified
    const user = await User.findOne({email: email, isVerified: true});
    if (!user) {
      const error = new Error(
        "No account found with this email. Please register first."
      );
      error.statusCode = 404;
      return next(error);
    }

    if (user.isLocked) {
      const error = new Error(
        "Account is locked. Please contact administrator"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Generate and save OTP
    const otpRecord = await OTP.createOTP(email, "login");

    // Send OTP email
    // TODO: Implement actual email sending service
    // const emailResult = await sendLoginOTPEmail(email, otpRecord.otp);
    //
    // if (!emailResult.success) {
    //   const error = new Error("Failed to send verification email");
    //   error.statusCode = 500;
    //   return next(error);
    // }

    // For now, we'll skip email sending and just return success
    console.log(`Login OTP for ${email}: ${otpRecord.otp}`);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      email: email,
    });
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify OTP and complete login
export const verifyLoginOTP = async (req, res, next) => {
  try {
    const {email, otp} = req.body;

    if (!email || !otp) {
      const error = new Error("Email and OTP are required");
      error.statusCode = 400;
      return next(error);
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: email,
      type: "login",
      isUsed: false,
    }).sort({createdAt: -1});

    if (!otpRecord) {
      const error = new Error("Invalid or expired verification code");
      error.statusCode = 400;
      return next(error);
    }

    // Verify OTP
    try {
      otpRecord.verifyOTP(otp);
      await otpRecord.save();
    } catch (otpError) {
      const error = new Error(otpError.message);
      error.statusCode = 400;
      return next(error);
    }

    // Find user
    const user = await User.findOne({email: email, isVerified: true});
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (user.isLocked) {
      const error = new Error(
        "Account is locked. Please contact administrator"
      );
      error.statusCode = 403;
      return next(error);
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      await user.save();
    }

    await otpRecord.deleteOne();

    // Generate tokens
    const accessToken = jwt.sign({userId: user._id}, JWT_SECRET || "secret", {
      expiresIn: JWT_EXPIRES_IN || "1h",
    });

    const refreshToken = jwt.sign(
      {userId: user._id},
      REFRESH_TOKEN_SECRET || "refresh_secret",
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN || "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasCompletedProfile: user.hasCompletedProfile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===== PASSWORD RESET FLOW =====

export const sendPasswordResetOTP = async (req, res, next) => {
  try {
    const {email} = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    // Find user by email
    const user = await User.findOne({email: email, isVerified: true});
    if (!user) {
      const error = new Error("No account found with this email");
      error.statusCode = 404;
      return next(error);
    }

    // Generate and save OTP
    const otpRecord = await OTP.createOTP(email, "password_reset");

    // Send OTP email
    // TODO: Implement actual email sending service
    // const emailResult = await sendPasswordResetOTPEmail(email, otpRecord.otp);
    //
    // if (!emailResult.success) {
    //   const error = new Error("Failed to send verification email");
    //   error.statusCode = 500;
    //   return next(error);
    // }

    // For now, we'll skip email sending and just return success
    console.log(`Password reset OTP for ${email}: ${otpRecord.otp}`);

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
      email: email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPasswordResetOTP = async (req, res, next) => {
  try {
    const {email, otp, newPassword} = req.body;

    if (!email || !otp || !newPassword) {
      const error = new Error("Email, OTP, and new password are required");
      error.statusCode = 400;
      return next(error);
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email: email,
      type: "password_reset",
      isUsed: false,
    }).sort({createdAt: -1});

    if (!otpRecord) {
      const error = new Error("Invalid or expired verification code");
      error.statusCode = 400;
      return next(error);
    }

    // Verify OTP
    try {
      otpRecord.verifyOTP(otp);
      await otpRecord.save();
    } catch (otpError) {
      const error = new Error(otpError.message);
      error.statusCode = 400;
      return next(error);
    }

    // Find user
    const user = await User.findOne({email: email, isVerified: true});
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and unlock account if locked
    user.password = hashedPassword;
    user.loginAttempts = 0;
    user.isLocked = false;
    await user.save();

    // Delete the used OTP record
    await otpRecord.deleteOne();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// ===== TOKEN MANAGEMENT =====

export const refreshToken = async (req, res, next) => {
  try {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 400;
      return next(error);
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET || "refresh_secret"
      );
    } catch (error) {
      error.message = "Invalid or expired refresh token";
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isVerified) {
      const error = new Error("User not found or not verified");
      error.statusCode = 404;
      return next(error);
    }

    const newAccessToken = jwt.sign(
      {userId: user._id},
      JWT_SECRET || "secret",
      {expiresIn: JWT_EXPIRES_IN || "1h"}
    );

    const newRefreshToken = jwt.sign(
      {userId: user._id},
      REFRESH_TOKEN_SECRET || "refresh_secret",
      {expiresIn: REFRESH_TOKEN_EXPIRES_IN || "7d"}
    );

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // Nothing to revoke since we don't store refresh tokens
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    // The user info is already available from the auth middleware
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if user account is locked
    if (user.isLocked) {
      const error = new Error("Account is locked");
      error.statusCode = 403;
      return next(error);
    }

    // Check if email is verified
    if (!user.isVerified) {
      const error = new Error("Email not verified");
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      success: true,
      valid: true,
      message: "Token is valid",
      user: {
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
    // Return consistent error format for invalid tokens
    res.status(401).json({
      success: false,
      valid: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// Improved token authentication middleware with better error handling
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      valid: false,
      message: "Access token is required",
      code: "NO_TOKEN"
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      let errorResponse = {
        success: false,
        valid: false,
        message: "Token verification failed"
      };

      if (err.name === "TokenExpiredError") {
        errorResponse.message = "Token has expired";
        errorResponse.code = "TOKEN_EXPIRED";
      } else if (err.name === "JsonWebTokenError") {
        errorResponse.message = "Invalid token";
        errorResponse.code = "INVALID_TOKEN";
      } else {
        errorResponse.message = "Token verification failed";
        errorResponse.code = "TOKEN_VERIFICATION_FAILED";
      }

      return res.status(401).json(errorResponse);
    }

    // Add decoded user info to request
    req.user = decoded;
    next();
  });
};
