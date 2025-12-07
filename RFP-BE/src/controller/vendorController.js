import prisma from "../config/db.js";
import { vendorSchema } from "../utils/validation.js";
import { z } from "zod";
import { produceActivityEvent } from "../services/kafka.js";

export const createVendor = async (req, res) => {
  try {
    vendorSchema.parse(req.body);
    const { name, email, category } = req.body;

    const existingUser = await prisma.vendor.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: "false", message: "Email already exists" });
    }

    const saveEmail = email.toLowerCase();

    const vendor = await prisma.vendor.create({
      data: {
        name,
        email:saveEmail,
        category,
      },
    });

    await produceActivityEvent(`You created vendor : ${name}`);

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.issues[0].message });
    }

    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const { search } = req.query;
    const vendors = await prisma.vendor.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
    });

    return res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(id) },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    await produceActivityEvent(`You deleted vendor ${vendor.name}`);

    await prisma.vendor.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
    });
  }
};
