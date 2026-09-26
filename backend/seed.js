const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const URI = process.env.MONGO_URI || "mongodb+srv://abhuzaifa70_db_user:5oAWJVfFOlqAjpPO@freshcart.mvcaucg.mongodb.net/freshcart?appName=FreshCart";

async function seed() {
  try {
    await mongoose.connect(URI);
    console.log('Connected to DB...');

    let admin = await User.findOne({ email: 'admin@freshcart.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@freshcart.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    const categoriesData = [
      { name: 'Produce', image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=400&q=80' },
      { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1528750711904-7a31b9d4cba7?auto=format&fit=crop&w=400&q=80' },
      { name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80' },
      { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pantry', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80' }
    ];

    const createdCategories = [];
    for (let c of categoriesData) {
      let cat = await Category.findOne({ name: c.name });
      if (!cat) cat = await Category.create(c);
      createdCategories.push(cat);
    }
    console.log('Categories seeded');

    const productsData = [
      { name: 'Organic Bananas', category: 'Produce', price: 2.99, unit: 'bunch', stock: 50, image: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Avocado', category: 'Produce', price: 1.50, unit: 'each', stock: 100, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80' },
      { name: 'Strawberries', category: 'Produce', price: 4.99, unit: 'pack', stock: 30, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80' },
      { name: 'Whole Milk', category: 'Dairy & Eggs', price: 3.49, unit: 'gallon', stock: 40, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80' },
      { name: 'Large Brown Eggs', category: 'Dairy & Eggs', price: 5.99, unit: 'dozen', stock: 25, image: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cheddar Cheese', category: 'Dairy & Eggs', price: 4.50, unit: 'block', stock: 60, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=400&q=80' },
      { name: 'Chicken Breast', category: 'Meat & Seafood', price: 8.99, unit: 'lb', stock: 20, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ground Beef 80/20', category: 'Meat & Seafood', price: 6.99, unit: 'lb', stock: 35, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80' },
      { name: 'Salmon Fillet', category: 'Meat & Seafood', price: 12.99, unit: 'lb', stock: 15, image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sourdough Loaf', category: 'Bakery', price: 5.50, unit: 'loaf', stock: 20, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Croissants', category: 'Bakery', price: 4.00, unit: 'pack of 4', stock: 15, image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88f4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Extra Virgin Olive Oil', category: 'Pantry', price: 14.99, unit: 'bottle', stock: 40, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
      { name: 'Spaghetti Pasta', category: 'Pantry', price: 2.50, unit: 'box', stock: 80, image: 'https://images.unsplash.com/photo-1612832021026-375ae70f24bf?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tomato Sauce', category: 'Pantry', price: 3.20, unit: 'jar', stock: 65, image: 'https://images.unsplash.com/photo-1558961053-90ceebceecfb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Honey', category: 'Pantry', price: 6.75, unit: 'jar', stock: 30, image: 'https://images.unsplash.com/photo-1587049352847-4d4fa73491dd?auto=format&fit=crop&w=400&q=80' },
    ];

    for (let p of productsData) {
      let existing = await Product.findOne({ name: p.name });
      if (!existing) {
        const cat = createdCategories.find(c => c.name === p.category);
        await Product.create({
          ...p,
          category: cat._id,
          createdBy: admin._id
        });
      }
    }
    console.log('Products seeded');

    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
