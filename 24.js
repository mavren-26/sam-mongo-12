const result = await Order.aggregate([
  { $match: { status: "delivered" } },
  { $group: { _id: "$userId", totalSpent: { $sum: "$totalAmount" } } },
  { $sort: { totalSpent: -1 } }
]);
console.log(result);
