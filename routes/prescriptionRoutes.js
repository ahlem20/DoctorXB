import express from 'express';
import { getPrescriptions, createPrescription, getPrescriptionsByPatient, getPrescriptionById, deletePrescription } from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getPrescriptions).post(protect, createPrescription);
router.route('/patient/:id').get(protect, getPrescriptionsByPatient);
router.route('/:id').get(protect, getPrescriptionById).delete(protect, deletePrescription);

export default router;
