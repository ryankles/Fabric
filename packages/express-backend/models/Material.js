import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    ownerUserId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: { type: String, required: true, enum: ["link", "text", "file"] },
    url: { type: String, default: "" },
    content: { type: String, default: "" },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);
