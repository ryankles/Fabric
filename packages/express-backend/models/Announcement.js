import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
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
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
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
