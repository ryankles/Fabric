import jwt from "jsonwebtoken";

/**
 * Verifies Bearer JWT and sets req.userId for authorization-scoped handlers.
 * Expects tokens signed by the auth teammate with payload: { userId: string }.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.slice("Bearer ".length);

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
