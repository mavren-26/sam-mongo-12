const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function detectAnomalies() {
  await client.connect();
  const db = client.db("activityDB");

  const result = await db.collection("logins").aggregate([
    {
      $group: {
        _id: {
          userId: "$userId",
          day: { $dateToString: { format: "%Y-%m-%d", date: "$loginTime" } }
        },
        dailyCount: { $sum: 1 }
      }
    },
    {
      $setWindowFields: {
        partitionBy: "$_id.userId",
        output: {
          avgCount: { $avg: "$dailyCount" }
        }
      }
    },
    {
      $match: {
        $expr: { $gt: ["$dailyCount", { $multiply: ["$avgCount", 2] }] }
      }
    },
    { $project: { userId: "$_id.userId", day: "$_id.day", dailyCount: 1, avgCount: 1 } }
  ]).toArray();

  console.log(result);
  await client.close();
}

detectAnomalies();
