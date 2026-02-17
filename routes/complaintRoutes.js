const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// @route   POST /api/complaints
// @desc    Create a complaint
router.post('/', async (req, res) => {
    try {
        const { studentId, studentName, message } = req.body;
        const newComplaint = new Complaint({
            studentId,
            studentName,
            message
        });
        const complaint = await newComplaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/complaints
// @desc    Get all complaints (Admin)
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ date: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/complaints/student/:id
// @desc    Get complaints by student ID
router.get('/student/:id', async (req, res) => {
    try {
        const complaints = await Complaint.find({ studentId: req.params.id }).sort({ date: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/complaints/:id/reply
// @desc    Reply to a complaint (Admin)
router.put('/:id/reply', async (req, res) => {
    try {
        const { reply } = req.body;
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ msg: 'Complaint not found' });
        }

        complaint.reply = reply;
        complaint.status = 'Replied';

        await complaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
