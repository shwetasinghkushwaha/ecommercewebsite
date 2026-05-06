const Product = require('../models/Product');

// GET /api/products  ?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
exports.getProducts = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 8,
  } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category && category !== 'All') filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(50, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
};

exports.getCategories = async (_req, res) => {
  const cats = await Product.distinct('category');
  res.json(cats);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;
  if (!name || !description || !price || !image || !category)
    return res.status(400).json({ message: 'All fields are required' });
  const product = await Product.create({ name, description, price, image, category, stock });
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

// POST /api/products/:id/reviews   { rating, comment }
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment)
    return res.status(400).json({ message: 'Rating and comment are required' });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ message: 'You already reviewed this product' });

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added', product });
};
