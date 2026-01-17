const express = require('express');
const router = express.Router();
const {
  createReceipt,
  getStudentsPaymentStatus
} = require('../controllers/receiptController');

router.post('/', createReceipt);
router.get('/students-payment', getStudentsPaymentStatus);

module.exports = router;
