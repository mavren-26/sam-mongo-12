// Import MongoDB driver
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://localhost:27017"; // replace with your own connection string if using Atlas

// Create a client instance
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();

    // Select database and collection
    const database = client.db("companyDB");
    const employees = database.collection("employees");

    // Find all employees sorted by salary in descending order
    const sortedEmployees = await employees
      .find({})
      .sort({ salary: -1 })
      .toArray();

    // Print result
    console.log("Employees sorted by salary (high to low):");
    console.log(sortedEmployees);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the function
run();
