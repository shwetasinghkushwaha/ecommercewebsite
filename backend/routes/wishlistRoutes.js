const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getWishlist, toggleWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
