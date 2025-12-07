import express from "express";
import {
  getRecentActivities,
  dashboardRFPData,
  getHistory,
  getPromptDetail,
} from "../controller/dashboardController.js";

const router = express.Router();

router.get("/activities", getRecentActivities);
router.get("/brief-data", dashboardRFPData);
router.get(`/get-history`, getHistory);
router.get("/get-history-detail/:id", getPromptDetail);

export default router;
