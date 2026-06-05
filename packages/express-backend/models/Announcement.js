import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        "general",
        "assignment",
        "exam",
        "urgent"
      ],
      default: "general"
    },
    publishAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
