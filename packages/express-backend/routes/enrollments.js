import express from "express";
import Enrollment from "../models/Enrollment.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const enrollments = await Enrollment.find();
  res.json(enrollments);
});

router.get("/my", requireAuth, async (req, res) => {
  const enrollments = await Enrollment.find({
    userId: req.userId
  });

  res.json(enrollments);
});

router.post("/", requireAuth, async (req, res) => {
  const enrollment = await Enrollment.create(req.body);
  res.status(201).json(enrollment);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Enrollment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//module.exports = router;
export default router;
