import { Router } from "express";
import Attendance from "../models/Attendance.js";
import { protect, facultyOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().populate("studentId", "name rollNumber").sort({ date: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: "Could not fetch attendance.", detail: error.message }); }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    res.json({ records, total, present, percentage: total ? Math.round(present / total * 100) : 0 });
  } catch (error) { res.status(400).json({ message: "Could not fetch attendance.", detail: error.message }); }
});

router.post("/", facultyOnly, async (req, res) => {
  try { res.status(201).json(await Attendance.create(req.body)); }
  catch (error) { res.status(400).json({ message: "Could not record attendance.", detail: error.message }); }
});

export default router;
