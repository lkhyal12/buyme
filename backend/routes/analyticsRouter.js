import express from "express";
import {
  getAnalytics,
  getDailySalesData,
} from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/", async (req, res) => {
  try {
    const analyticsData = await getAnalytics();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);
    console.log({ analyticsData });
    console.log({ dailySalesData });
    return res.status(200).json({ message: "", analyticsData, dailySalesData });
  } catch (err) {
    console.log("error in the analyticsROuter ", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default analyticsRouter;
