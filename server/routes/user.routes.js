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
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

// ===== PUBLIC ROUTES =====
// Fetch all users (admin only - consider adding role-based auth)
userRouter.get("/", getUsers);

// ===== AUTHENTICATED ROUTES =====
// Get current user profile
userRouter.get("/me", authorize, getCurrentUser);

// Complete user profile (after OTP verification)
userRouter.post("/complete-profile", authorize, completeProfile);

// Update profile information
userRouter.put("/profile", authorize, updateProfile);

// Update password
userRouter.put("/password", authorize, updatePassword);

// Update PIN
userRouter.put("/pin", authorize, updatePin);

// Delete current user account
userRouter.delete("/me", authorize, deleteUser);

// ===== ADMIN ROUTES (with ID parameters) =====
// Fetch a single user by ID (admin only)
userRouter.get("/:id", authorize, getUser);

// Update an existing user by ID (admin only)
userRouter.put("/:id", authorize, updateUser);

// Delete a user by ID (admin only)
userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;
