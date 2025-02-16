const express = require('express');
const { placeOrder, getOrders } = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, placeOrder);
router.get('/', authenticate, getOrders);

module.exports = router;
