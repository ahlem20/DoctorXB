import Prescription from '../models/Prescription.js';

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({})
    .populate('patient', 'fullName age')
    .populate('doctor', 'name')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private
const createPrescription = async (req, res) => {
  const { patientId, medicines, analyses, radios, notes, price } = req.body;

  const hasMedicines = medicines && medicines.length > 0;
  const hasAnalyses = analyses && analyses.length > 0;
  const hasRadios = radios && radios.length > 0;

  if (!patientId || (!hasMedicines && !hasAnalyses && !hasRadios)) {
    res.status(400);
    throw new Error('Please provide patient and at least one medicine, analysis, or radio');
  }

  const prescription = new Prescription({
    patient: patientId,
    doctor: req.user._id,
    medicines: medicines || [],
    analyses: analyses || [],
    radios: radios || [],
    notes,
    price: price || 0,
  });

  const createdPrescription = await prescription.save();
  res.status(201).json(createdPrescription);
};

// @desc    Get prescriptions for a specific patient
// @route   GET /api/prescriptions/patient/:id
// @access  Private
const getPrescriptionsByPatient = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.params.id })
    .populate('doctor', 'name')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patient', 'fullName age gender address phoneNumber')
    .populate('doctor', 'name phone address');

  if (prescription) {
    res.json(prescription);
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
};

// @desc    Delete single prescription by ID
// @route   DELETE /api/prescriptions/:id
// @access  Private
const deletePrescription = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (prescription) {
    await Prescription.deleteOne({ _id: prescription._id });
    res.json({ message: 'Ordonnance supprimée' });
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
};

export { getPrescriptions, createPrescription, getPrescriptionsByPatient, getPrescriptionById, deletePrescription };
