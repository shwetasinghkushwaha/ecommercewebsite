const router = require('express').Router();
const { getCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getCart);
router.post('/', addItem);
router.put('/:productId', updateItem);
router.delete('/:productId', removeItem);
router.delete('/', clearCart);

module.exports = router;
