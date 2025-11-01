const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function deleteInactiveUsers() {
  await client.connect();
  const db = client.db("socialApp");
  const users = db.collection("users");

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const result = await users.deleteMany({
    lastLogin: { $lt: oneYearAgo }
  });

  console.log(`${result.deletedCount} inactive users deleted.`);
  await client.close();
}

deleteInactiveUsers();
