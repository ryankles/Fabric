import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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
    dueDate: {
      type: Date,
      required: true
    },
    pointsPossible: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      enum: [
        "homework",
        "quiz",
        "exam",
        "project",
        "lab"
      ],
      default: "homework"
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
  "Assignment",
  assignmentSchema
);
