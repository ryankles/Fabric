import express from "express";
import Course from "../models/Course.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

router.get("/:id", requireAuth, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res
      .status(404)
      .json({ message: "Course not found" });
  }

  res.json(course);
});

router.post("/", requireAuth, async (req, res) => {
  const course = await Course.create({
    ...req.body,
    teacherId: req.userId
  });

  res.status(201).json(course);
});

router.put("/:id", requireAuth, async (req, res) => {
  const updated = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//module.exports = router;
export default router;
