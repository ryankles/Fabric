import express from "express";
import Submission from "../models/Submission.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/assignment/:assignmentId", requireAuth, async (req, res) => {
  const submissions = await Submission.find({
    assignmentId: req.params.assignmentId
  });

  res.json(submissions);
});

router.post("/", requireAuth, async (req, res) => {
  const submission = await Submission.create({
    ...req.body,
    studentId: req.user.id
  });

  res.status(201).json(submission);
});

//module.exports = router;
export default router;
