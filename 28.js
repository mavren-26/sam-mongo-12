const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = "mongodb://localhost:27017";

async function findStudentsWithGradeAInMath() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("school"); // your database name
    const students = database.collection("students");

    // Find students with grade "A" in Math
    const result = await students
      .find({ grade: "A", subject: "Math" }, { projection: { name: 1, _id: 0 } })
      .toArray();

    console.log("Students with grade A in Math:");
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

findStudentsWithGradeAInMath();
