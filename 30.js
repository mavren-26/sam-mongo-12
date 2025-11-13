const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  isActive: Boolean,
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);

// Function to find active users within last 7 days
async function findActiveUsers() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activeUsers = await User.find({
    isActive: true,
    lastLogin: { $gte: sevenDaysAgo }
  });

  console.log("Active users in last 7 days:");
  console.log(activeUsers);
}

findActiveUsers();
