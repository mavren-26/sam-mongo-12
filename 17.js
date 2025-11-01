const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function mostActiveUsers() {
  await client.connect();
  const db = client.db("socialApp");

  const result = await db.collection("users").aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "userId",
        as: "userPosts"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "userId",
        as: "userComments"
      }
    },
    {
      $addFields: {
        totalPosts: { $size: "$userPosts" },
        totalComments: { $size: "$userComments" },
        totalActivity: { $add: [{ $size: "$userPosts" }, { $size: "$userComments" }] }
      }
    },
    { $sort: { totalActivity: -1 } },
    { $limit: 5 },
    { $project: { name: 1, totalPosts: 1, totalComments: 1, totalActivity: 1 } }
  ]).toArray();

  console.log(result);
  await client.close();
}

mostActiveUsers();
