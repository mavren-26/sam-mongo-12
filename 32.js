import Activity from "../models/Activity.js";

export const getTopUsers = async (req, res) => {
  const result = await Activity.aggregate([
    {
      $group: {
        _id: "$userId",
        totalActivities: { $sum: 1 }
      }
    },
    { $sort: { totalActivities: -1 } },
    { $limit: 5 }
  ]);

  res.json(result);
};
