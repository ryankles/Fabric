import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
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
    description: String,
    type: {
      type: String,
      enum: [
        "document",
        "video",
        "link",
        "note",
        "other"
      ],
      default: "document"
    },
    url: String,
    content: String,
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
  "Material",
  materialSchema
);
