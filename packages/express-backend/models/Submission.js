import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

submissionSchema.index(
  {
    assignmentId: 1,
    studentId: 1
  },
  {
    unique: true
  }
);

export default mongoose.model(
  "Submission",
  submissionSchema
);
