const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function updateExpiredSubscriptions() {
  await client.connect();
  const db = client.db("streamingApp");
  const users = db.collection("users");

  const today = new Date();
  const result = await users.updateMany(
    { expiryDate: { $lt: today } },
    { $set: { subscriptionStatus: "expired" } }
  );

  console.log(`${result.modifiedCount} users updated.`);
  await client.close();
}

updateExpiredSubscriptions();
