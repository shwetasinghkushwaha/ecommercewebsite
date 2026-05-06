const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: 'Cart is empty' });

  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.image,
    price: i.product.price,
    qty: i.qty,
  }));
  const totalAmount = items.reduce((s, i) => s + i.price * i.qty, 0);

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    totalAmount,
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ message: 'Order placed successfully (Demo)', order });
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.allOrders = async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// PATCH /api/orders/:id/status  { status }
exports.updateStatus = async (req, res) => {
  const allowed = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const { status } = req.body;
  if (!allowed.includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};
