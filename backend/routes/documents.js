import express from "express";
import {
  getDocuments,
  createDocument,
  deleteDocument
} from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.use(protect);

router.get("/", getDocuments);
router.post("/", createDocument);
router.delete("/:id", authorize("Admin"), deleteDocument);

export default router;
