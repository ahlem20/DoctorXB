import express from 'express';
import {
  getCatalogAnalyses,
  getCatalogRadios,
  getCatalogMedicines,
  createCatalogAnalysis,
  createCatalogRadio,
  createCatalogMedicine,
  deleteCatalogAnalysis,
  deleteCatalogRadio,
  deleteCatalogMedicine
} from '../controllers/catalogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/analyses')
  .get(protect, getCatalogAnalyses)
  .post(protect, createCatalogAnalysis);

router.route('/analyses/:id')
  .delete(protect, deleteCatalogAnalysis);

router.route('/radios')
  .get(protect, getCatalogRadios)
  .post(protect, createCatalogRadio);

router.route('/radios/:id')
  .delete(protect, deleteCatalogRadio);

router.route('/medicines')
  .get(protect, getCatalogMedicines)
  .post(protect, createCatalogMedicine);

router.route('/medicines/:id')
  .delete(protect, deleteCatalogMedicine);

export default router;
