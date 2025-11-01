const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function leaderboard() {
  await client.connect();
  const db = client.db("socialApp");

  const result = await db.collection("users").aggregate([
    { $lookup: { from: "posts", localField: "_id", foreignField: "userId", as: "posts" } },
    { $lookup: { from: "comments", localField: "_id", foreignField: "userId", as: "comments" } },
    { $lookup: { from: "likes", localField: "_id", foreignField: "userId", as: "likes" } },
    {
      $addFields: {
        postCount: { $size: "$posts" },
        commentCount: { $size: "$comments" },
        likeCount: { $size: "$likes" },
        weightedScore: {
          $add: [
            { $multiply: [{ $size: "$posts" }, 5] },
            { $multiply: [{ $size: "$comments" }, 2] },
            { $size: "$likes" }
          ]
        }
      }
    },
    { $sort: { weightedScore: -1 } },
    { $limit: 10 },
    { $project: { name: 1, weightedScore: 1 } }
  ]).toArray();

  console.log(result);
  await client.close();
}

leaderboard();
