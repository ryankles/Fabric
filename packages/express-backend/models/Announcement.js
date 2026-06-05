import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: String,
      required: true,
      index: true
    },
    courseId: {
      type: String,
      required: true,
      index: true
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        "announcement",
        "reminder",
        "general",
        "assignment",
        "exam",
        "urgent"
      ],
      default: "announcement"
    },
    publishAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Announcement",
  announcementSchema
);
