const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Define product schema
const productSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  price: Number
});

const Product = mongoose.model('Product', productSchema);

// Function to find top 3 rated products
async function findTopRatedProducts() {
  const topProducts = await Product.find({ rating: { $gte: 4.5 } })
    .sort({ rating: -1 })
    .limit(3);

  console.log("Top 3 Rated Products:");
  console.log(topProducts);
}

findTopRatedProducts();
