import express from "express";
import {
  createConsultation,
  getPatientConsultations,
  deleteConsultation,
} from "../controllers/consultationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
console.log("consultationRoutes loaded");

// POST /api/consultation/:id/consultations
// GET  /api/consultation/:id/consultations
router
  .route("/:id/consultations")
  .post(protect, createConsultation)
  .get(protect, getPatientConsultations);

// DELETE /api/consultation/:id
router.delete(
  "/:id",
  protect,
  (req, res, next) => {
    console.log("DELETE ROUTE HIT:", req.params.id);
    next();
  },
  deleteConsultation
);
export default router;
