import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // Must be: Bearer <token>
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FINAL FIX: match token payload
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;
