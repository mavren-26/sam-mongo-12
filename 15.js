const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function searchPosts() {
  await client.connect();
  const db = client.db("blogDB");
  const posts = db.collection("posts");

  const result = await posts.find({
    $or: [
      { title: { $regex: /(AI|Machine Learning)/i } },
      { content: { $regex: /(AI|Machine Learning)/i } }
    ]
  }).toArray();

  console.log(result);
  await client.close();
}

searchPosts();
