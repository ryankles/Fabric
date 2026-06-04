import express from "express";
import Assignment from "../models/Assignment.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const assignments = await Assignment.find()
    .sort({ dueDate: 1 });

  res.json(assignments);
});

router.get("/upcoming", requireAuth, async (req, res) => {
  const assignments = await Assignment.find({
    dueDate: { $gte: new Date() }
  })
    .sort({ dueDate: 1 })
    .limit(10);

  res.json(assignments);
});

router.post("/", requireAuth, async (req, res) => {
  const assignment = await Assignment.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json(assignment);
});

router.put("/:id", requireAuth, async (req, res) => {
  const updated = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//module.exports = router;
export default router;
