const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function topRatedProducts() {
  await client.connect();
  const db = client.db("ecommerce");
  const products = db.collection("products");

  const result = await products.aggregate([
    { $sort: { category: 1, rating: -1 } },
    {
      $group: {
        _id: "$category",
        topProducts: { $push: { name: "$name", rating: "$rating" } }
      }
    },
    { $project: { topProducts: { $slice: ["$topProducts", 3] } } }
  ]).toArray();

  console.log(result);
  await client.close();
}

topRatedProducts();
