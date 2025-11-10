const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

async function countProductsUnderPrice() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("shop"); // your database name
    const products = database.collection("products");

    // Count products with price less than 50000
    const count = await products.countDocuments({ price: { $lt: 50000 } });

    console.log(`Number of products with price less than 50000: ${count}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

countProductsUnderPrice();
