import jwt from "jsonwebtoken";

/**
 * Verifies JWT from cookie (or Bearer header as fallback)
 * and sets req.userId for authorization-scoped handlers.
 */
export function requireAuth(req, res, next) {
  // Try cookie first, then fall back to Authorization header
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length);
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Missing authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = String(decoded.userId);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
