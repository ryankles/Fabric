import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    passwordHash: { type: String, required: true }, // porbably a bad idea, discuss with team and switch out
    role: {
      type: String,
      required: true,
      enum: ["student", "teacher"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
