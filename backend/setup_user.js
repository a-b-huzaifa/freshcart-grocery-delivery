require('dotenv').config({ quiet: true });
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

async function setup() {
  await connectDB(process.env.MONGO_URI);
  
  // Check if user exists
  let user = await User.findOne({ email: 'admin@example.com' });
  
  if (!user) {
    user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log('User created');
  }
  
  // Promote to admin
  user.role = 'admin';
  await user.save();
  console.log('User promoted to admin');
  
  process.exit(0);
}

setup().catch(console.error);
