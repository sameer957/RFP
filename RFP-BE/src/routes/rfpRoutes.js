import express from "express";

import {
  generateRFP,
  sendRFP,
  getAllRFPRequests,
  getSingleRFPDetail,
} from "../controller/rfpController.js";

const router = express.Router();

router.post("/create-prompt", generateRFP);

router.post("/send-mail", sendRFP);

router.get("/get-rfps", getAllRFPRequests);

router.get(`/get-rfp/:id`, getSingleRFPDetail);

export default router;
