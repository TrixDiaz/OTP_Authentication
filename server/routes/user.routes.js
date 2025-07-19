import {Router} from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  getCurrentUser,
  updateUser,
  completeProfile,
  updateProfile,
  updatePassword,
  updatePin,
} from "../controllers/user.controller.js";
import {authenticateToken} from "../controllers/auth.controller.js";

const userRouter = Router();

// ===== PUBLIC ROUTES =====
// Fetch all users (admin only - consider adding role-based auth)
userRouter.get("/", getUsers);

// ===== AUTHENTICATED ROUTES =====
// Get current user profile
userRouter.get("/me", authenticateToken, getCurrentUser);

// Complete user profile (after OTP verification)
userRouter.post("/complete-profile", authenticateToken, completeProfile);

// Update profile information
userRouter.put("/profile", authenticateToken, updateProfile);

// Update password
userRouter.put("/password", authenticateToken, updatePassword);

// Update PIN
userRouter.put("/pin", authenticateToken, updatePin);

// Delete current user account
userRouter.delete("/me", authenticateToken, deleteUser);

// ===== ADMIN ROUTES (with ID parameters) =====
// Fetch a single user by ID (admin only)
userRouter.get("/:id", authenticateToken, getUser);

// Update an existing user by ID (admin only)
userRouter.put("/:id", authenticateToken, updateUser);

// Delete a user by ID (admin only)
userRouter.delete("/:id", authenticateToken, deleteUser);

export default userRouter;
