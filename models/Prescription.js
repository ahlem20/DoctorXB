import mongoose from 'mongoose';

const prescriptionSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    notes: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
