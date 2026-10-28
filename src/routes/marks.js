import { Router } from "express";
import Mark from "../models/Mark.js";
import { protect, facultyOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", async (req, res) => {
  try { res.json(await Mark.find().populate("studentId", "name rollNumber").sort({ createdAt: -1 })); }
  catch (error) { res.status(500).json({ message: "Could not fetch marks.", detail: error.message }); }
});

router.get("/student/:studentId", async (req, res) => {
  try { res.json(await Mark.find({ studentId: req.params.studentId }).sort({ subject: 1 })); }
  catch (error) { res.status(400).json({ message: "Could not fetch marks.", detail: error.message }); }
});

router.post("/", facultyOnly, async (req, res) => {
  try { res.status(201).json(await Mark.create(req.body)); }
  catch (error) { res.status(400).json({ message: "Could not save marks.", detail: error.message }); }
});

export default router;
