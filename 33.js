import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const getTopRatedProducts = async (req, res) => {
  const result = await Product.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews"
      }
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
        totalReviews: { $size: "$reviews" }
      }
    },
    {
      $match: { averageRating: { $gte: 4 } }
    },
    {
      $project: {
        name: 1,
        averageRating: 1,
        totalReviews: 1
      }
    },
    { $sort: { averageRating: -1 } }
  ]);

  res.json(result);
};
