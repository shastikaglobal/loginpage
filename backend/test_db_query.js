const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({ email: { $in: ['sreenethra681@gmail.com', 'priyarajasekaran212@gmail.com'] } });
    console.log(`Found ${users.length} users:`);
    for (const u of users) {
      console.log({
        id: u._id,
        email: u.email,
        name: u.name,
        passwordHash: u.password,
        isBcrypt: u.password.startsWith('$2'), // bcrypt hashes start with $2a$, $2b$, or $2y$
      });
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error querying DB:', err.message);
  }
}

run();
