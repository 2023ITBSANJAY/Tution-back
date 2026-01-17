const Student = require('../models/Student');

// ➕ Create new student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const student = new Student({ name, email, mobile });
    await student.save();
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
    const { name, email, mobile } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, mobile },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
