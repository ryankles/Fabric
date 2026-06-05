import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: "",
      trim: true
    },
    type: {
      type: String,
      enum: [
        "document",
        "video",
        "link",
        "note",
        "other",
        "text",
        "file"
      ],
      default: "link"
    },
    url: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Material", materialSchema);
