import express from "express";
import Announcement from "../models/Announcement.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/announcements — all for this user, optional ?courseId= filter
router.get("/", async (req, res) => {
  try {
    const query = { ownerUserId: req.userId };
    if (req.query.courseId) query.courseId = req.query.courseId;
    const announcements = await Announcement.find(query).sort({ publishAt: -1 });
    res.json(announcements);
  } catch {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// POST /api/announcements
router.post("/", async (req, res) => {
  const { courseId, courseTitle, title, body, type, publishAt } = req.body;
  if (!courseId || !courseTitle || !title || !body || !type || !publishAt) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const announcement = await Announcement.create({
      ownerUserId: req.userId,
      courseId,
      courseTitle,
      title: title.trim(),
      body: body.trim(),
      type,
      publishAt
    });
    res.status(201).json(announcement);
  } catch {
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

// DELETE /api/announcements/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await Announcement.deleteOne({
      _id: req.params.id,
      ownerUserId: req.userId
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
