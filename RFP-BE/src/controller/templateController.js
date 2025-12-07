import prisma from "../config/db.js";
import { templates } from "../utils/templates.js";
import { produceActivityEvent } from "../services/kafka.js";

export const getTemplates = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const saveTemplate = async (req, res) => {
  try {
    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({
        success: false,
        messgae: "Template not selected",
      });
    }

    await prisma.Templates.create({
      data: {
        templateId,
      },
    });

    await produceActivityEvent("You changed the template");

    return res.status(200).json({
      success: true,
      message: "Template saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSelectedTemplate = async (req, res) => {
  try {
    const lastTemplateUsed = await prisma.Templates.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastTemplateUsed) {
      return res.status(200).json({
        success: true,
        message: "No template selected till now",
      });
    }
    const selectedTemp = templates.find(
      (tem) => tem.id === lastTemplateUsed.templateId,
    );

    return res.status(200).json({
      success: true,
      message:"Template Fetched",
      data: selectedTemp,
    });
  } catch (error) {
    console.error("Error fetching last selected template:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
