import { Router } from "express";
import Assignment from "../models/Assignment.js";
import { protect, facultyOnly } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", async (req, res) => {
  try { res.json(await Assignment.find().populate("createdBy", "name").sort({ dueDate: 1 })); }
  catch (error) { res.status(500).json({ message: "Could not fetch assignments.", detail: error.message }); }
});

router.post("/", facultyOnly, async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(assignment);
  } catch (error) { res.status(400).json({ message: "Could not create assignment.", detail: error.message }); }
});

export default router;
