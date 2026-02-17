const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

// Secret key (in production, use .env)
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// @route   POST /api/auth/register-admin
// @desc    Register a new admin
router.post('/register-admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin = new Admin({
            name,
            email,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login-admin
// @desc    Authenticate admin & get token
router.post('/login-admin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Return user info (excluding password)
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: 'admin'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login-student
// @desc    Authenticate student & get token
router.post('/login-student', async (req, res) => {
    try {
        const { studentId, password } = req.body;

        // Check student by Student ID
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(400).json({ message: 'Invalid Student ID' });
        }

        // Check password
        console.log(`[DEBUG] Checking password for ${student.studentId}`);
        console.log(`[DEBUG] Has stored password? ${!!student.password}`);

        // Legacy Support: If student has no password set
        // Check password
        let isMatch = false;

        if (!student.password) {
            // Case 1: No password set -> Allow ID as password
            if (password === student.studentId) {
                isMatch = true;
            }
        } else {
            // Case 2: Password set -> Check hash
            isMatch = await bcrypt.compare(password, student.password);

            // Case 3: Hash failed, but user typed Student ID (Auto-Fix/Reset)
            if (!isMatch && password === student.studentId) {
                isMatch = true;
            }
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        // Return student info
        res.json({
            _id: student._id,
            name: student.name,
            studentId: student.studentId,
            email: student.email,
            role: 'student'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
