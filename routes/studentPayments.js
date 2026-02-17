const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Receipt = require("../models/Receipt");

// ✅ Get Payable / Non-Payable Students for selected month
router.get("/students-payment", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) return res.status(400).json({ message: "Month is required" });

    // ✅ Fetch all students
    const allStudents = await Student.find();

    // ✅ Fetch receipts for that month and populate student
    const receipts = await Receipt.find({ month }).populate("student");

    // ✅ Filter out receipts where student might have been deleted (student: null)
    const validReceipts = receipts.filter(r => r.student);

    // ✅ Create list of PAID student IDs
    const paidStudentIds = validReceipts.map(r => r.student._id.toString());

    // ✅ Split into two lists
    const nonPayable = allStudents
      .filter(s => !paidStudentIds.includes(s._id.toString()))
      .map(s => ({ studentId: s.studentId, studentName: s.name }));

    const payable = validReceipts.map(r => ({
      studentId: r.student.studentId || "N/A",
      studentName: r.student.name || "Unknown Student"
    }));

    res.json({ payable, nonPayable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get Payment History for specific Student
router.get("/student-history/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find receipts for this student, sorted by newest first
    const receipts = await Receipt.find({ student: studentId })
      .sort({ createdAt: -1 });

    res.json(receipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
