import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student"
    }
  },
  {
    timestamps: true
  }
);

enrollmentSchema.index(
  {
    userId: 1,
    courseId: 1
  },
  {
    unique: true
  }
);

export default mongoose.model(
  "Enrollment",
  enrollmentSchema
);
