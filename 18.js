const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function monthlyRevenueGrowth() {
  await client.connect();
  const db = client.db("shopDB");

  const result = await db.collection("orders").aggregate([
    {
      $group: {
        _id: { month: { $month: "$orderDate" }, year: { $year: "$orderDate" } },
        totalRevenue: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $setWindowFields: {
        sortBy: { "_id.year": 1, "_id.month": 1 },
        output: {
          previousRevenue: { $shift: { output: "$totalRevenue", by: -1 } }
        }
      }
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        totalRevenue: 1,
        growthPercent: {
          $cond: [
            { $gt: ["$previousRevenue", 0] },
            { $multiply: [{ $divide: [{ $subtract: ["$totalRevenue", "$previousRevenue"] }, "$previousRevenue"] }, 100] },
            0
          ]
        }
      }
    }
  ]).toArray();

  console.log(result);
  await client.close();
}

monthlyRevenueGrowth();
