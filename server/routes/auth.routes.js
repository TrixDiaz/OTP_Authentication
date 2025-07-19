import {Router} from "express";
import {
  // New OTP-based authentication
  sendRegistrationOTP,
  verifyRegistrationOTP,
  sendLoginOTP,
  verifyLoginOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOTP,

  // Token management
  refreshToken,
  signOut,
  authenticateToken,
  validateToken,
} from "../controllers/auth.controller.js";

const authRouter = Router();

// ===== NEW OTP-BASED AUTHENTICATION ROUTES =====

// Registration flow
authRouter.post("/send-registration-otp", sendRegistrationOTP);
authRouter.post("/verify-registration-otp", verifyRegistrationOTP);

// Login flow
authRouter.post("/send-login-otp", sendLoginOTP);
authRouter.post("/verify-login-otp", verifyLoginOTP);

// Password reset flow
authRouter.post("/send-password-reset-otp", sendPasswordResetOTP);
authRouter.post("/verify-password-reset-otp", verifyPasswordResetOTP);

// Token management
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/sign-out", signOut);
authRouter.get("/validate-token", authenticateToken, validateToken);

export default authRouter;
