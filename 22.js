const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function movingAverageSales() {
  await client.connect();
  const db = client.db("ecommerce");

  const result = await db.collection("sales").aggregate([
    {
      $group: {
        _id: { productId: "$productId", date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
        totalRevenue: { $sum: "$revenue" }
      }
    },
    { $sort: { "_id.productId": 1, "_id.date": 1 } },
    {
      $setWindowFields: {
        partitionBy: "$_id.productId",
        sortBy: { "_id.date": 1 },
        output: {
          movingAvgRevenue: {
            $avg: "$totalRevenue",
            window: { range: [-6, 0], unit: "day" }
          }
        }
      }
    },
    { $project: { productId: "$_id.productId", date: "$_id.date", totalRevenue: 1, movingAvgRevenue: 1 } }
  ]).toArray();

  console.log(result);
  await client.close();
}

movingAverageSales();
