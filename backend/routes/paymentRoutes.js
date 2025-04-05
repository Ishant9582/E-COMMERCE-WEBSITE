const express = require('express');
const { createOrder,validateOrder } = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/orders', createOrder);
router.post('/order/validate',validateOrder);
module.exports = router;