const mongoose = require('mongoose');


const ReceiptSchema = new mongoose.Schema({
tuitionName: { type: String, default: 'Dream Tution Center' },
address: { type: String, default: `Door No 50,\n1st floor,pachaiyapan Nagar, 1st street,\nRakkiyapalayam pirvu, Tiruppur-641606` },
student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
month: { type: String, required: true },
amount: { type: Number, required: true },
receiverSignature: { type: String },
}, { timestamps: true });


module.exports = mongoose.model('Receipt', ReceiptSchema);