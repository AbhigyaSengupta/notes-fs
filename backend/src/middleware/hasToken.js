// import jwt from "jsonwebtoken";
// import userSchema from "../models/userSchema.js";
// import sessionSchema from "../models/sessionSchema.js";

// export const hasToken = async (req, res, next) => {
//   try {
//     const authHeaders = req.headers.authorization;
//     if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
//     }

//     const token = authHeaders.split(" ")[1];

//     // Use promisified verify or a wrapper to avoid deep nesting
//     jwt.verify(token, process.env.secretKey, async (err, decoded) => {
//       if (err) {
//         return res.status(401).json({
//           success: false,
//           message: err.name === "TokenExpiredError" ? "Expired" : "Invalid Token",
//         });
//       }

//       const { id } = decoded;
      
//       // Parallel check for performance
//       const [user, session] = await Promise.all([
//         userSchema.findById(id),
//         sessionSchema.findOne({ userId: id })
//       ]);

//       if (!user || !session) {
//         return res.status(401).json({ success: false, message: "Session invalid" });
//       }

//       req.userId = id;
//       next();
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Server Auth Error" });
//   }
// };

import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";
import sessionSchema from "../models/sessionSchema.js";

export const hasToken = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;

    // Verify header exists and follows Bearer format
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token found.",
      });
    }

    const token = authHeaders.split(" ")[1];

    // Verify the JWT using your secret key
    jwt.verify(token, process.env.secretKey, async (err, decoded) => {
      if (err) {
        const message = err.name === "TokenExpiredError" 
          ? "Session expired. Please login again." 
          : "Invalid access token.";
        return res.status(401).json({ success: false, message });
      }

      const { id } = decoded;

      // Check both User and Session existence in parallel for speed
      const [user, session] = await Promise.all([
        userSchema.findById(id),
        sessionSchema.findOne({ userId: id }),
      ]);

      if (!user || !session) {
        return res.status(401).json({
          success: false,
          message: "Session is invalid or user no longer exists.",
        });
      }

      // Attach the ID for use in getAllNotes
      req.userId = id;
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};