import express from "express";
import Grade from "../models/Grade.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/my", requireAuth, async (req, res) => {
  const grades = await Grade.find({
    studentId: req.userId
  });

  res.json(grades);
});

router.post("/", requireAuth, async (req, res) => {
  const grade = await Grade.create({
    ...req.body,
    gradedBy: req.userId
  });

  res.status(201).json(grade);
});

//module.exports = router;
export default router;
