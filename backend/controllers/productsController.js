import { redis } from "../lib/redis.js";
import ProductModel from "../models/productModel.js";

export const getAllProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    return res
      .status(200)
      .json({ message: "Products sent successfully", products });
  } catch (err) {
    console.log("error in the getAllProductsController ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// featured controller
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts)
      return res.status(200).json({
        message: "Featured products sent successfully",
        featuredProducts: JSON.parse(featuredProducts),
      });
    featuredProducts = await ProductModel.findOne({ isFeatured: true }).lean();
    if (!featuredProducts)
      return res.status(404).json({ message: "No featured products found" });

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    return res.status(200).json({
      message: "Featured products sent successfully",
      featuredProducts: JSON.stringify(featuredProducts),
    });
  } catch (err) {
    console.log("error in the getFeatured products controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};
