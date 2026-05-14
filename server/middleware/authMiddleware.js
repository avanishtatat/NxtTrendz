import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is not defined. Server cannot start without it.");
}

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
