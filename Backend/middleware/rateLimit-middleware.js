import rateLimit from "express-rate-limit"
const isDevelopment = process.env.NODE_ENV !== "production";

 const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 10, // keep dev flexible, strict in production
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export default apiLimiter;