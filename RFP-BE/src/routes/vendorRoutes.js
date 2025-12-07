import express from "express";
import {
  createVendor,
  getAllVendors,
  deleteVendor,
} from "../controller/vendorController.js";

const router = express.Router();

router.post("/create-vendor", createVendor);
router.get("/vendors", getAllVendors);
router.delete("/vendors/:id", deleteVendor);

export default router;
