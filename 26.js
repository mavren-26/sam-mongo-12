// Using Mongoose in Node.js

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testdb');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function findActiveUsers() {
  const activeUsers = await User.find({ isActive: true });
  console.log(activeUsers);
}

findActiveUsers();
