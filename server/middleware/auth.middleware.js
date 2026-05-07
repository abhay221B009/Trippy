import jwt from "jsonwebtoken";

export const requireAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const headerParts = authHeader.split(" ");
    if(!headerParts[0] || headerParts[0] !== "Bearer") {
      return res.status(401).json({
        message: "invalid auth header",
      })
    }

    const token = headerParts[1];
    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};