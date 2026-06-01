import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import Patient from '../models/Patient.js';

// @desc    Get all appointments (optional filter by date range)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = {};

    if (start && end) {
      query.dateTime = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'fullName age gender phoneNumber')
      .populate('doctor', 'name role')
      .sort({ dateTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, dateTime, duration, reason, notes } = req.body;

    const appointment = new Appointment({
      patient,
      doctor,
      dateTime,
      duration: duration || 30,
      reason: reason || '',
      notes: notes || '',
      status: 'Confirmed',
    });

    const createdAppointment = await appointment.save();
    
    // Populate for response
    const populated = await Appointment.findById(createdAppointment._id)
      .populate('patient', 'fullName')
      .populate('doctor', 'name');

    // Trigger notification
    const notification = new Notification({
      message: `Nouveau rendez-vous planifié pour ${populated.patient.fullName} avec ${populated.doctor.name}`,
      type: 'appointment',
    });
    await notification.save();

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid data' });
  }
};

// @desc    Update appointment details or status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { dateTime, duration, reason, notes, status, doctor } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      const oldStatus = appointment.status;

      appointment.dateTime = dateTime || appointment.dateTime;
      appointment.duration = duration || appointment.duration;
      appointment.reason = reason !== undefined ? reason : appointment.reason;
      appointment.notes = notes !== undefined ? notes : appointment.notes;
      appointment.status = status || appointment.status;
      appointment.doctor = doctor || appointment.doctor;

      const updatedAppointment = await appointment.save();

      const populated = await Appointment.findById(updatedAppointment._id)
        .populate('patient', 'fullName')
        .populate('doctor', 'name');

      // Trigger notification if patient is marked as Attended (Arrived)
      if (status === 'Attended' && oldStatus !== 'Attended') {
        const notification = new Notification({
          message: `Le patient ${populated.patient.fullName} est arrivé à la clinique`,
          type: 'arrival',
        });
        await notification.save();
      }

      res.json(populated);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Update failed' });
  }
};

// @desc    Delete/Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      await Appointment.deleteOne({ _id: appointment._id });
      res.json({ message: 'Appointment cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Cancellation failed' });
  }
};

export { getAppointments, createAppointment, updateAppointment, deleteAppointment };
