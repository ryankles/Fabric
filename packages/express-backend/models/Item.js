import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    ownerUserId: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
