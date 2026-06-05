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
        name: { type: String },
        dosage: { type: String },
        duration: { type: String },
      },
    ],
    analyses: [
      {
        catalogId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogAnalysis' },
        name: { type: String },
      },
    ],
    radios: [
      {
        catalogId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogRadio' },
        name: { type: String },
        notes: { type: String },
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
