import prisma from "../config/db.js";
import { getTimeAgo } from "../utils/timeHelper.js";

export async function getRecentActivities(req, res) {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const response = activities.map((a) => ({
      id: a.id,
      title: a.title,
      createdAt: a.createdAt,
      timeAgo: getTimeAgo(a.createdAt),
    }));

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.error("Error fetching activities", err);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const dashboardRFPData = async (req, res) => {
  try {
    const rfpsCreated = await prisma.rFPRequest.count();
    const proposalReceived = await prisma.EmailReply.count();
    const vendorCount = await prisma.vendor.count();

    return res.status(200).json({
      success: true,
      data: {
        rfpsCreated: rfpsCreated,
        proposalReceived: proposalReceived,
        vendorCount: vendorCount,
      },
      message: "Data fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await prisma.rFPRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const response = history.map((a) => ({
      id: a.id,
      prompt: a.prompt,
      createdAt: a.createdAt,
      timeAgo: getTimeAgo(a.createdAt),
    }));

    return res.status(200).json({
      success: true,
      message: "History fetched Successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getPromptDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(404).json({
        success: true,
        message: "History does not found",
      });
    }

    const response = await prisma.rfpResponse.findUnique({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "History details fetched Successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
