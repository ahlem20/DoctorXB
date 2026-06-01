import PatientNote from '../models/PatientNote.js';
import Patient from '../models/Patient.js';

// @desc    Get notes for a patient
// @route   GET /api/patients/:id/notes
// @access  Private
const getPatientNotes = async (req, res) => {
  try {
    const notes = await PatientNote.find({ patient: req.params.id })
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Add a note to a patient file
// @route   POST /api/patients/:id/notes
// @access  Private
const addPatientNote = async (req, res) => {
  try {
    const { note } = req.body;
    const patientId = req.params.id;

    if (!note) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patientNote = new PatientNote({
      patient: patientId,
      author: req.user._id,
      note,
    });

    const savedNote = await patientNote.save();
    const populatedNote = await PatientNote.findById(savedNote._id).populate('author', 'name role');

    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to add note' });
  }
};

export { getPatientNotes, addPatientNote };
