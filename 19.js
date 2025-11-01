const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function recommendProducts(userId) {
  await client.connect();
  const db = client.db("shopDB");

  const result = await db.collection("orders").aggregate([
    { $match: { userId: userId } },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "orders",
        localField: "products",
        foreignField: "products",
        as: "relatedOrders"
      }
    },
    { $unwind: "$relatedOrders" },
    { $match: { "relatedOrders.userId": { $ne: userId } } },
    {
      $group: {
        _id: null,
        allProducts: { $addToSet: "$relatedOrders.products" },
        userProducts: { $addToSet: "$products" }
      }
    },
    {
      $project: {
        recommended: { $setDifference: [{ $reduce: { input: "$allProducts", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } }, "$userProducts"] }
      }
    }
  ]).toArray();

  console.log(result[0].recommended);
  await client.close();
}

recommendProducts(1);
