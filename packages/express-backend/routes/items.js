import express from "express";
import Item from "../models/Item.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ ownerUserId: req.userId });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    const item = await Item.create({
      title: title.trim(),
      ownerUserId: req.userId
    });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.ownerUserId !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(item);
  } catch {
    res.status(400).json({ error: "Invalid item id" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Item.deleteOne({
      _id: req.params.id,
      ownerUserId: req.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid item id" });
  }
});

export default router;
