import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    term: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Course", courseSchema);
