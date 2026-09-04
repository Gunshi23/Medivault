import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = express.Router();

router.use(protect);

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.patch("/:id/status", updateAppointment);
router.delete("/:id", authorize("Admin"), deleteAppointment);

export default router;
