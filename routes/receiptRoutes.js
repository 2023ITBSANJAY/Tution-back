const express = require('express');
const router = express.Router();
const {
  createReceipt,
  getStudentsPaymentStatus,
  downloadReceipt
} = require('../controllers/receiptController');

router.post('/', createReceipt);
router.get('/:id/download', downloadReceipt);

module.exports = router;
