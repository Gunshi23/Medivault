import express from "express";
import {
  getRecords,
  getRecordById,
  getPatientRecords,
  createRecord,
  updateRecord,
  deleteRecord
} from "../controllers/recordController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.use(protect);

router.get("/", getRecords);
router.get("/:id", getRecordById);
router.get("/patient/:patientId", getPatientRecords);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", authorize("Admin"), deleteRecord);

export default router;
