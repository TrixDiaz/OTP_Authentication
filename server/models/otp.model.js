import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      minLength: 6,
      maxLength: 6,
    },
    type: {
      type: String,
      required: true,
      enum: ["register", "login", "password_reset"],
      default: "login",
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5, // Maximum 5 attempts
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
  },
  {
    timestamps: true,
  }
);

// Create index for automatic deletion of expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create index for faster email lookups
otpSchema.index({ email: 1, type: 1 });

// Method to verify OTP
otpSchema.methods.verifyOTP = function(inputOTP) {
  if (this.isUsed) {
    throw new Error("OTP has already been used");
  }
  
  if (this.expiresAt < new Date()) {
    throw new Error("OTP has expired");
  }
  
  if (this.attempts >= 5) {
    throw new Error("Maximum OTP attempts exceeded");
  }
  
  this.attempts += 1;
  
  if (this.otp !== inputOTP) {
    throw new Error("Invalid OTP");
  }
  
  this.isUsed = true;
  return true;
};

// Static method to generate random 6-digit OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create new OTP
otpSchema.statics.createOTP = async function(email, type = "login") {
  // Remove any existing unused OTPs for this email and type
  await this.deleteMany({ 
    email: email, 
    type: type, 
    isUsed: false 
  });
  
  const otp = this.generateOTP();
  
  return await this.create({
    email,
    otp,
    type,
  });
};

const OTP = mongoose.model("OTP", otpSchema);

export default OTP; 