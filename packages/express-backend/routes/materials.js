import express from "express";
import Material from "../models/Material.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const query = { ownerUserId: req.userId };

    if (req.query.courseId) {
      query.courseId = req.query.courseId;
    }

    const materials = await Material.find(query).sort({
      createdAt: -1
    });

    res.json(materials);
  } catch {
    res
      .status(500)
      .json({ error: "Failed to fetch materials" });
  }
});

router.get("/course/:courseId", async (req, res) => {
  try {
    const materials = await Material.find({
      ownerUserId: req.userId,
      courseId: req.params.courseId
    }).sort({ createdAt: -1 });

    res.json(materials);
  } catch {
    res
      .status(500)
      .json({ error: "Failed to fetch materials" });
  }
});

router.post("/", async (req, res) => {
  const {
    courseId,
    courseTitle,
    title,
    description,
    type,
    url,
    content,
    createdBy
  } = req.body;

  if (!courseId || !courseTitle || !title || !createdBy) {
    return res.status(400).json({
      error:
        "courseId, courseTitle, title, and createdBy are required"
    });
  }

  try {
    const material = await Material.create({
      ownerUserId: req.userId,
      courseId,
      courseTitle,
      title: title.trim(),
      description: description?.trim() ?? "",
      type,
      url: url ?? "",
      content: content ?? "",
      createdBy
    });

    res.status(201).json(material);
  } catch {
    res
      .status(500)
      .json({ error: "Failed to create material" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Material.deleteOne({
      _id: req.params.id,
      ownerUserId: req.userId
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Material not found" });
    }

    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
