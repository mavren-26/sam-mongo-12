const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function userOrderSummary() {
  await client.connect();
  const db = client.db("shopDB");
  const orders = db.collection("orders");

  const summary = await orders.aggregate([
    {
      $group: {
        _id: "$userId",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$amount" }
      }
    },
    { $sort: { totalSpent: -1 } }
  ]).toArray();

  console.log(summary);
  await client.close();
}

userOrderSummary();
