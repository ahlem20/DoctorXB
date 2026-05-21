import Patient from '../models/Patient.js';

// @desc    Get all active patients
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        fullName: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const patients = await Patient.find({ ...keyword, status: 'Active' }).sort({ createdAt: -1 });
  res.json(patients);
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
};

// @desc    Create a patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  const { fullName, age, gender, phoneNumber, address, allergies, medicalHistory, doctorNotes } = req.body;

  const patient = new Patient({
    fullName,
    age,
    gender,
    phoneNumber,
    address,
    allergies,
    medicalHistory,
    doctorNotes,
  });

  const createdPatient = await patient.save();
  res.status(201).json(createdPatient);
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  const { fullName, age, gender, phoneNumber, address, allergies, medicalHistory, doctorNotes } = req.body;

  const patient = await Patient.findById(req.params.id);

  if (patient) {
    patient.fullName = fullName || patient.fullName;
    patient.age = age || patient.age;
    patient.gender = gender || patient.gender;
    patient.phoneNumber = phoneNumber || patient.phoneNumber;
    patient.address = address || patient.address;
    patient.allergies = allergies || patient.allergies;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.doctorNotes = doctorNotes || patient.doctorNotes;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
};

// @desc    Archive a patient
// @route   PUT /api/patients/:id/archive
// @access  Private
const archivePatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    patient.status = 'Archived';
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    await Patient.deleteOne({ _id: patient._id });
    res.json({ message: 'Patient supprimé' });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
};

export { getPatients, getPatientById, createPatient, updatePatient, archivePatient, deletePatient };
