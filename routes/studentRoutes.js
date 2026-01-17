const express = require('express');
const router = express.Router();
const {
  addStudent,
  getAllStudents,
  deleteStudent,
  updateStudent
} = require('../controllers/studentController');

// Create
router.post('/', addStudent);

// Read
router.get('/', getAllStudents);

// Update
router.put('/:id', updateStudent);

// Delete
router.delete('/:id', deleteStudent);

module.exports = router;
