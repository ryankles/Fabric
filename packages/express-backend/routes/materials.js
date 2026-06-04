import express from "express";
import Material from "../models/Material.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/course/:courseId", requireAuth, async (req, res) => {
  const materials = await Material.find({
    courseId: req.params.courseId
  });

  res.json(materials);
});

router.post("/", requireAuth, async (req, res) => {
  const material = await Material.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json(material);
});

//module.exports = router;
export default router;
