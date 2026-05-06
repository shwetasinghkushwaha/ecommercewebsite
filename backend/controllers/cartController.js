const Cart = require('../models/Cart');

const getOrCreate = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

exports.getCart = async (req, res) => {
  const cart = await getOrCreate(req.user._id);
  res.json(cart);
};

exports.addItem = async (req, res) => {
  const { productId, qty = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx >= 0) cart.items[idx].qty += Number(qty);
  else cart.items.push({ product: productId, qty: Number(qty) });

  await cart.save();
  const populated = await cart.populate('items.product');
  res.json(populated);
};

exports.updateItem = async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  if (qty <= 0) cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  else item.qty = qty;
  await cart.save();
  const populated = await cart.populate('items.product');
  res.json(populated);
};

exports.removeItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  const populated = await cart.populate('items.product');
  res.json(populated);
};

exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared' });
};
