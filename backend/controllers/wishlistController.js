const User = require('../models/User');

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist || []);
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });

  const user = await User.findById(req.user._id);
  const idx = user.wishlist.findIndex((id) => id.toString() === productId);
  let added;
  if (idx >= 0) {
    user.wishlist.splice(idx, 1);
    added = false;
  } else {
    user.wishlist.push(productId);
    added = true;
  }
  await user.save();
  res.json({ added, wishlist: user.wishlist });
};

exports.removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  res.json({ wishlist: user.wishlist });
};
