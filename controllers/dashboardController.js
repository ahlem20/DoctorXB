import Patient from '../models/Patient.js';
import Prescription from '../models/Prescription.js';
// Import other models as needed for stats

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments({ status: 'Active' });
    
    // Patients created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const patientsToday = await Patient.countDocuments({
      createdAt: { $gte: today },
    });

    const recentPrescriptions = await Prescription.countDocuments(); 
    
    // Calculate daily revenue
    const todaysPrescriptions = await Prescription.find({
      createdAt: { $gte: today },
    });
    const dailyRevenue = todaysPrescriptions.reduce((acc, curr) => acc + (curr.price || 0), 0);

    res.json({
      totalPatients,
      patientsToday,
      recentPrescriptions,
      dailyRevenue,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Server error retrieving stats');
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private
const getRecentActivity = async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ createdAt: -1 }).limit(5);
    const prescriptions = await Prescription.find({}).populate('patient', 'fullName').populate('doctor', 'name').sort({ createdAt: -1 }).limit(5);

    let activity = [];

    patients.forEach(p => {
      activity.push({
        id: `pat_${p._id}`,
        type: 'Patient',
        message: `New patient registered: ${p.fullName}`,
        time: p.createdAt,
      });
    });

    prescriptions.forEach(p => {
      activity.push({
        id: `pre_${p._id}`,
        type: 'Prescription',
        message: `Dr. ${p.doctor?.name || 'Doctor'} wrote a prescription for ${p.patient?.fullName || 'Unknown'}`,
        time: p.createdAt,
      });
    });

    activity.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    res.json(activity.slice(0, 5));
  } catch (error) {
    res.status(500);
    throw new Error('Server Error fetching activity');
  }
};

export { getDashboardStats, getRecentActivity };
