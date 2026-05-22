import { Profiler } from "react";
import cloudinary from "../lib/cloudinary.js";
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

// create products controller
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
      category,
    });
    return res
      .status(201)
      .json({ message: "Product created successully", product });
  } catch (err) {
    console.log("error in the createProduct controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// delete product controller
export const deleteProductController = async (req, res) => {
  const productId = req.params.id;
  if (!productId) return res.status(400).json({ message: "Missing productId" });
  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("image deleted");
      } catch (err) {
        console.log("error trying image from cloudinary", err);
      }
    }
    await ProductModel.findByIdAndDelete(productId);
    return res.status(200).json({ message: "Server error" });
  } catch (err) {
    console.log("error in delete controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};
