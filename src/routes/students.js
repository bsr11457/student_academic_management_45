import { Router } from "express";
import Student from "../models/Student.js";
import { protect, facultyOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "");
    const students = await Student.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) { res.status(500).json({ message: "Could not fetch students.", detail: error.message }); }
});

router.post("/", facultyOnly, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) { res.status(400).json({ message: "Could not create student. Check required fields and unique roll number.", detail: error.message }); }
});

router.put("/:id", facultyOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (error) { res.status(400).json({ message: "Could not update student.", detail: error.message }); }
});

router.delete("/:id", facultyOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted." });
  } catch (error) { res.status(400).json({ message: "Could not delete student.", detail: error.message }); }
});

export default router;
