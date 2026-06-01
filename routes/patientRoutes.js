import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  archivePatient,
  deletePatient,
} from '../controllers/patientController.js';
import {
  getPatientNotes,
  addPatientNote,
} from '../controllers/patientNoteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/:id').get(protect, getPatientById).put(protect, updatePatient).delete(protect, deletePatient);
router.route('/:id/archive').put(protect, archivePatient);
router.route('/:id/notes').get(protect, getPatientNotes).post(protect, addPatientNote);

export default router;
