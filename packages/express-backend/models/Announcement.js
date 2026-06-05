import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    ownerUserId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["announcement", "reminder"] },
    publishAt: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
