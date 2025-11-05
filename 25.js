const result = await Employee.aggregate([
  { $sort: { department: 1, salary: -1 } },
  { $group: { _id: "$department", topEmployees: { $push: "$$ROOT" } } },
  { $project: { department: "$_id", top3: { $slice: ["$topEmployees", 3] }, _id: 0 } }
]);
console.log(result);
