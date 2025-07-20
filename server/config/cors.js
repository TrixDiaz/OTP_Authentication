// CORS Configuration
export const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow client origin
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200, // For legacy browser support
};

export default corsOptions;
