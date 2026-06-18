const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const Coupon = require('./models/couponModel');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const categories = [
  { name: 'Smartphones', description: 'Latest smartphones and accessories', isActive: true, image: { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' } },
  { name: 'Laptops', description: 'Laptops and notebooks', isActive: true, image: { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853' } },
  { name: 'Headphones', description: 'Wireless and wired headphones', isActive: true, image: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' } },
  { name: 'Watches', description: 'Smartwatches and analog watches', isActive: true, image: { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' } },
  { name: 'Cameras', description: 'Digital cameras and lenses', isActive: true, image: { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' } },
  { name: 'Gaming', description: 'Consoles and gaming accessories', isActive: true, image: { url: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128' } },
];

const products = [
  {
    title: 'Apple iPhone 16 Pro Max',
    description: 'The latest Apple iPhone 16 Pro Max featuring A18 Pro chip, 256GB storage, titanium design and advanced camera system with 48MP main sensor.',
    price: 149999,
    discountedPrice: 139999,
    stock: 25,
    images: [
      { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569', public_id: 'iphone16_front' },
      { url: 'https://images.unsplash.com/photo-1695637147838-8eb0c7e2f8ef', public_id: 'iphone16_back' },
    ],
    ratings: 4.8,
    numOfReviews: 245,
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    tags: ['Apple', 'iPhone', 'Smartphone', '5G', 'Premium'],
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra with Galaxy AI, S Pen, 200MP camera and Snapdragon 8 Gen 3 processor.',
    price: 134999,
    discountedPrice: 124999,
    stock: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', public_id: 's24_front' },
      { url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3', public_id: 's24_back' },
    ],
    ratings: 4.7,
    numOfReviews: 189,
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    tags: ['Samsung', 'Galaxy', 'Smartphone', '5G', 'Android'],
  },
  {
    title: 'MacBook Pro 16" M3 Max',
    description: 'Apple MacBook Pro with M3 Max chip, 36GB unified memory, 1TB SSD, and stunning Liquid Retina XDR display.',
    price: 249999,
    discountedPrice: 234999,
    stock: 15,
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', public_id: 'macbook_front' },
      { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9', public_id: 'macbook_side' },
    ],
    ratings: 4.9,
    numOfReviews: 312,
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
    tags: ['Apple', 'MacBook', 'Laptop', 'Premium'],
  },
  {
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life and multipoint connection.',
    price: 29990,
    discountedPrice: 24990,
    stock: 50,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', public_id: 'sony_xm5' },
    ],
    ratings: 4.6,
    numOfReviews: 567,
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    tags: ['Sony', 'Headphones', 'Wireless', 'Noise Cancelling'],
  },
  {
    title: 'Apple Watch Ultra 2',
    description: 'Most rugged and capable Apple Watch yet with precision dual-frequency GPS, 49mm titanium case and up to 36 hours battery.',
    price: 89990,
    discountedPrice: 84990,
    stock: 20,
    images: [
      { url: 'https://images.unsplash.com/photo-1546868871-af0de0ae72f4', public_id: 'watch_ultra' },
    ],
    ratings: 4.7,
    numOfReviews: 134,
    isFeatured: false,
    isTrending: true,
    isNewArrival: true,
    tags: ['Apple', 'Watch', 'Fitness', 'Premium'],
  },
  {
    title: 'Sony PlayStation 5 Slim',
    description: 'PlayStation 5 Slim console with 1TB SSD, DualSense wireless controller and support for 4K gaming at 120fps.',
    price: 44990,
    discountedPrice: 42990,
    stock: 40,
    images: [
      { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', public_id: 'ps5' },
    ],
    ratings: 4.8,
    numOfReviews: 890,
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
    tags: ['Sony', 'PlayStation', 'Gaming', 'Console'],
  },
  {
    title: 'Canon EOS R5 Mark II',
    description: 'Canon mirrorless camera with 45MP full-frame sensor, 8K video recording and advanced AI autofocus.',
    price: 389990,
    discountedPrice: 369990,
    stock: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32', public_id: 'canon_r5' },
    ],
    ratings: 4.9,
    numOfReviews: 76,
    isFeatured: true,
    isTrending: false,
    isNewArrival: true,
    tags: ['Canon', 'Camera', 'Mirrorless', 'Professional'],
  },
  {
    title: 'AirPods Pro 2nd Gen',
    description: 'AirPods Pro with USB-C, adaptive audio, personalized spatial audio and up to 2x more active noise cancellation.',
    price: 24900,
    discountedPrice: 22900,
    stock: 100,
    images: [
      { url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b3e1', public_id: 'airpods_pro' },
    ],
    ratings: 4.5,
    numOfReviews: 1203,
    isFeatured: false,
    isTrending: true,
    isNewArrival: true,
    tags: ['Apple', 'AirPods', 'Earbuds', 'Wireless'],
  },
  {
    title: 'Samsung Galaxy Book4 Ultra',
    description: 'Samsung Galaxy Book4 Ultra with Intel Core Ultra 9, 32GB RAM, 1TB SSD and NVIDIA RTX 4070.',
    price: 219990,
    discountedPrice: 199990,
    stock: 12,
    images: [
      { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', public_id: 'galaxy_book' },
    ],
    ratings: 4.4,
    numOfReviews: 45,
    isFeatured: false,
    isTrending: false,
    isNewArrival: true,
    tags: ['Samsung', 'Laptop', 'Windows', 'Premium'],
  },
  {
    title: 'Nothing Phone (3)',
    description: 'Nothing Phone (3) with Glyph Interface, 50MP dual camera and MediaTek Dimensity 9200+ chipset.',
    price: 39999,
    stock: 35,
    images: [
      { url: 'https://images.unsplash.com/photo-1719622768319-3ed0c0f5c3a0', public_id: 'nothing_phone' },
    ],
    ratings: 4.3,
    numOfReviews: 89,
    isFeatured: false,
    isTrending: true,
    isNewArrival: true,
    tags: ['Nothing', 'Smartphone', 'Android', '5G'],
  },
];

const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minCartValue: 500,
    maxDiscount: 2000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2027-12-31'),
    usageLimit: 1000,
    isActive: true,
  },
  {
    code: 'SAVE500',
    discountType: 'fixed',
    discountValue: 500,
    minCartValue: 5000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2027-12-31'),
    usageLimit: 500,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 40,
    minCartValue: 0,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2027-12-31'),
    usageLimit: 200,
    isActive: true,
  },
];

const seed = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await User.deleteMany({ role: { $ne: 'admin' } });

    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);

    const productData = products.map((p, i) => ({
      ...p,
      category: createdCategories[i % createdCategories.length]._id,
    }));

    const createdProducts = await Product.insertMany(productData);
    console.log(`${createdProducts.length} products created`);

    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`${createdCoupons.length} coupons created`);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin created: admin@example.com / admin123`);

    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
    });
    console.log(`User created: user@example.com / user123`);

    console.log('\n--- Seed complete ---');
    console.log(`Admin login: admin@example.com / admin123`);
    console.log(`User login:  user@example.com / user123`);
    console.log(`Coupons: WELCOME10, SAVE500, FREESHIP`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
