import asyncHandler from 'express-async-handler';
import CatalogAnalysis from '../models/CatalogAnalysis.js';
import CatalogRadio from '../models/CatalogRadio.js';
import CatalogMedicine from '../models/CatalogMedicine.js';

// @desc  Get all analysis catalog items
// @route GET /api/catalog/analyses
// @access Private
export const getCatalogAnalyses = asyncHandler(async (req, res) => {
  const items = await CatalogAnalysis.find({}).sort({ category: 1, name: 1 });
  res.json(items);
});

// @desc  Get all radiology catalog items
// @route GET /api/catalog/radios
// @access Private
export const getCatalogRadios = asyncHandler(async (req, res) => {
  const items = await CatalogRadio.find({}).sort({ category: 1, name: 1 });
  res.json(items);
});

// @desc  Get all medicine catalog items
// @route GET /api/catalog/medicines
// @access Private
export const getCatalogMedicines = asyncHandler(async (req, res) => {
  const items = await CatalogMedicine.find({}).sort({ category: 1, name: 1 });
  res.json(items);
});

// @desc  Create an analysis catalog item (admin utility)
// @route POST /api/catalog/analyses
// @access Private
export const createCatalogAnalysis = asyncHandler(async (req, res) => {
  const item = await CatalogAnalysis.create(req.body);
  res.status(201).json(item);
});

// @desc  Create a radiology catalog item (admin utility)
// @route POST /api/catalog/radios
// @access Private
export const createCatalogRadio = asyncHandler(async (req, res) => {
  const item = await CatalogRadio.create(req.body);
  res.status(201).json(item);
});

// @desc  Create a medicine catalog item
// @route POST /api/catalog/medicines
// @access Private
export const createCatalogMedicine = asyncHandler(async (req, res) => {
  const item = await CatalogMedicine.create(req.body);
  res.status(201).json(item);
});

// @desc  Delete an analysis catalog item
// @route DELETE /api/catalog/analyses/:id
// @access Private
export const deleteCatalogAnalysis = asyncHandler(async (req, res) => {
  const item = await CatalogAnalysis.findById(req.params.id);
  if (item) {
    await CatalogAnalysis.deleteOne({ _id: item._id });
    res.json({ message: 'Analyse supprimée' });
  } else {
    res.status(404);
    throw new Error('Analysis not found');
  }
});

// @desc  Delete a radiology catalog item
// @route DELETE /api/catalog/radios/:id
// @access Private
export const deleteCatalogRadio = asyncHandler(async (req, res) => {
  const item = await CatalogRadio.findById(req.params.id);
  if (item) {
    await CatalogRadio.deleteOne({ _id: item._id });
    res.json({ message: 'Radio supprimée' });
  } else {
    res.status(404);
    throw new Error('Radiology item not found');
  }
});

// @desc  Delete a medicine catalog item
// @route DELETE /api/catalog/medicines/:id
// @access Private
export const deleteCatalogMedicine = asyncHandler(async (req, res) => {
  const item = await CatalogMedicine.findById(req.params.id);
  if (item) {
    await CatalogMedicine.deleteOne({ _id: item._id });
    res.json({ message: 'Médicament supprimé' });
  } else {
    res.status(404);
    throw new Error('Medicine item not found');
  }
});
