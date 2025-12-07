import express from "express";
import {
  getTemplates,
  saveTemplate,
  getSelectedTemplate,
} from "../controller/templateController.js";

const router = express.Router();

router.get("/get-templates", getTemplates);
router.post("/save-template", saveTemplate);
router.get("/get-saved-template", getSelectedTemplate);

export default router;
