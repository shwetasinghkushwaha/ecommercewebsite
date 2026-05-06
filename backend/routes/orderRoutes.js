const router = require('express').Router();
const { placeOrder, myOrders, allOrders, updateStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/mine', protect, myOrders);
router.get('/', protect, admin, allOrders);
router.patch('/:id/status', protect, admin, updateStatus);

module.exports = router;
