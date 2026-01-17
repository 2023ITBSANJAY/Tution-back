const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String }
}, { timestamps: true });

// Auto-generate studentId like DT001, DT002... up to DT20000
StudentSchema.pre('validate', async function (next) {
  if (this.isNew && !this.studentId) {
    try {
      const lastStudent = await mongoose.model('Student').findOne().sort({ createdAt: -1 });
      let newNumber = 1;

      if (lastStudent && lastStudent.studentId) {
        const lastNum = parseInt(lastStudent.studentId.replace('DT', ''), 10);
        if (!isNaN(lastNum)) newNumber = lastNum + 1;
      }

      // Stop at 20000
      if (newNumber > 20000) {
        return next(new Error('Student ID limit reached (DT20000). Cannot create more students.'));
      }

      this.studentId = `DT${String(newNumber).padStart(3, '0')}`;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Student', StudentSchema);
