import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "_id name email role createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch {
    res.status(400).json({ error: "Invalid user id" });
  }
});

export default router;
