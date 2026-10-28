import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: String, required: true, trim: true },
  internalMarks: { type: Number, min: 0, max: 100, required: true },
  externalMarks: { type: Number, min: 0, max: 100, required: true }
}, { timestamps: true });

export default mongoose.model("Mark", markSchema);
