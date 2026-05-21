import mongoose from 'mongoose';

const patientSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    allergies: {
      type: [String],
    },
    medicalHistory: {
      type: String,
    },
    doctorNotes: {
      type: String,
    },
    firstVisitDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Archived'],
      default: 'Active',
    }
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
