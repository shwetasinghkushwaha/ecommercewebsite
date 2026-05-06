require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  { name: 'Wireless Bluetooth Headphones', description: 'Over-ear noise cancelling headphones with 30hr battery.', price: 2499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', category: 'Electronics', stock: 50 },
  { name: 'Smart Fitness Watch', description: 'Heart rate, SpO2, GPS, 7-day battery life.', price: 3299, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', category: 'Electronics', stock: 80 },
  { name: 'Running Shoes - Men', description: 'Lightweight breathable mesh running shoes.', price: 1899, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', category: 'Footwear', stock: 120 },
  { name: 'Cotton Casual T-Shirt', description: '100% cotton round neck t-shirt, multiple colors.', price: 499, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', category: 'Clothing', stock: 200 },
  { name: 'Laptop Backpack 25L', description: 'Water-resistant backpack with USB charging port.', price: 1299, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', category: 'Accessories', stock: 90 },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit blue switches mechanical keyboard.', price: 2799, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', category: 'Electronics', stock: 60 },
  { name: 'Stainless Steel Water Bottle', description: '1L vacuum insulated, keeps cold 24h / hot 12h.', price: 699, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', category: 'Accessories', stock: 150 },
  { name: 'Yoga Mat Premium', description: '6mm thick non-slip exercise mat with carry strap.', price: 899, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600', category: 'Sports', stock: 100 },
  { name: 'Sunglasses Polarized', description: 'UV400 polarized aviator sunglasses, unisex.', price: 999, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', category: 'Accessories', stock: 70 },
  { name: 'Smartphone 128GB', description: '6.5" AMOLED, 64MP camera, 5000mAh battery.', price: 14999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', category: 'Electronics', stock: 40 },
  { name: 'Wooden Study Desk', description: 'Compact engineered wood desk with drawer.', price: 4499, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600', category: 'Furniture', stock: 25 },
  { name: 'Coffee Maker 4-Cup', description: 'Drip coffee maker with auto shut-off.', price: 1799, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600', category: 'Home', stock: 35 },
];

(async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(products);

  const adminEmail = 'admin@shop.com';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    await User.create({ name: 'Admin', email: adminEmail, password: 'admin123', isAdmin: true });
    console.log('Admin created -> admin@shop.com / admin123');
  }

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
})();
