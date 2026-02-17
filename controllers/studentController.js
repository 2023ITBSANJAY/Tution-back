const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// ➕ Create new student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    // Password will be auto-set to ID in model hook if NOT provided
    const student = new Student({ name, email, mobile });
    await student.save(); // Model pre-save hook will hash the password
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 🧾 Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, password } = req.body;

    let updateData = { name, email, mobile };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
