import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 150,
      default: null, // Optional initially, set during profile completion
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minLength: 6,
      default: null, // Optional initially, set during profile completion
    },
    pin: {
      type: String,
      minLength: 4,
      default: null, // Set during profile completion
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "moderator"],
    },
    permissions: {
      type: [String],
      enum: ["full-control", "read", "write", "modify", "delete"],
      default: [],
    },
    profileCompleted: {
      type: Boolean,
      default: false, // True when user has set name, password, and PIN
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Virtual to check if user has completed their profile
userSchema.virtual("hasCompletedProfile").get(function () {
  return this.name && this.password && this.pin;
});

const User = mongoose.model("User", userSchema);

export default User;
