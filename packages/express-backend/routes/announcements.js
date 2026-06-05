import express from "express";
import Announcement from "../models/Announcement.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const announcements = await Announcement.find().sort({
    publishAt: -1
  });

  res.json(announcements);
});

router.get("/recent", requireAuth, async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ publishAt: -1 })
    .limit(5);

  res.json(announcements);
});

router.post("/", requireAuth, async (req, res) => {
  const announcement = await Announcement.create({
    ...req.body,
    createdBy: req.userId
  });

  res.status(201).json(announcement);
});

//export default module.exports = router;
export default router;
