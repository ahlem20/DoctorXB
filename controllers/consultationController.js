import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Consultation from "../models/Consultation.js";
import Patient from "../models/Patient.js";

// @desc  Create a consultation for a patient
// @route POST /api/patients/:id/consultations
// @access Private
export const createConsultation = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const { vitals, consultation, analyses, radios, duration } = req.body;

  // Sanitize vitals: remove empty strings, null, undefined, or invalid numbers
  const sanitizedVitals = {};
  if (vitals && typeof vitals === "object") {
    Object.keys(vitals).forEach((key) => {
      const val = vitals[key];
      if (val !== "" && val !== null && val !== undefined) {
        const num = Number(val);
        if (!isNaN(num)) {
          sanitizedVitals[key] = num;
        }
      }
    });
  }

  // Sanitize analyses catalogId
  const sanitizedAnalyses = Array.isArray(analyses)
    ? analyses.map((a) => ({
        catalogId:
          a.catalogId && mongoose.Types.ObjectId.isValid(a.catalogId)
            ? a.catalogId
            : undefined,
        name: a.name || "",
        result: a.result || "",
        unit: a.unit || "",
        status: a.status || "En attente",
      }))
    : [];

  // Sanitize radios catalogId
  const sanitizedRadios = Array.isArray(radios)
    ? radios.map((r) => ({
        catalogId:
          r.catalogId && mongoose.Types.ObjectId.isValid(r.catalogId)
            ? r.catalogId
            : undefined,
        name: r.name || "",
        notes: r.notes || "",
        bodyRegion: r.bodyRegion || "",
      }))
    : [];

  const doc = await Consultation.create({
    patient: patient._id,
    doctor: req.user._id,
    vitals: sanitizedVitals,
    complaint: consultation?.complaint || "",
    symptoms: consultation?.symptoms || "",
    diagnosis: consultation?.diagnosis || "",
    subjective: consultation?.subjective || "",
    objective: consultation?.objective || "",
    assessment: consultation?.assessment || "",
    plan: consultation?.plan || "",
    analyses: sanitizedAnalyses,
    radios: sanitizedRadios,
    duration: duration || 0,
  });

  res.status(201).json(doc);
});

// @desc  Get all consultations for a patient
// @route GET /api/patients/:id/consultations
// @access Private
export const getPatientConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({
    patient: req.params.id,
  }).sort({ createdAt: -1 });
  res.json(consultations);
});

// @desc  Delete a consultation
// @route DELETE /api/consultation/:id
// @access Private
export const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    res.status(404);
    throw new Error("Consultation non trouvée");
  }

  await consultation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Consultation supprimée avec succès",
  });
});
