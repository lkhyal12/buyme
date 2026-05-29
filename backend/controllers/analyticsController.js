import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
export const getAnalytics = async () => {
  const totalUser = await UserModel.countDocuments();
  const totalProducts = await ProductModel.countDocuments();

  const salesData = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalRevenue, totalSales } = salesData[0] || {
    totalRevenue: 0,
    totalSales: 0,
  };
  return {
    users: totalUser,
    products: totalProducts,
    totalRevenue,
    totalSales,
  };
};
