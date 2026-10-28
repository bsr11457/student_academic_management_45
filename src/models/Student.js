import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, unique: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  department: { type: String, default: "CSE (AI&ML)" },
  year: { type: Number, min: 1, max: 6, default: 3 },
  section: { type: String, default: "A" }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
