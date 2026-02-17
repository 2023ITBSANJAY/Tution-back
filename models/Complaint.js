const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['Pending', 'Replied'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
