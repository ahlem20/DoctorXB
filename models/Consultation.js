import mongoose from 'mongoose';

const consultationSchema = mongoose.Schema(
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
    vitals: {
      heartRate: { type: Number },
      bpSystolic: { type: Number },
      bpDiastolic: { type: Number },
      temperature: { type: Number },
      spo2: { type: Number },
      bloodSugar: { type: Number },
      weight: { type: Number },
      height: { type: Number },
      bmi: { type: Number },
    },
    complaint: {
      type: String,
      default: '',
    },
    symptoms: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      default: '',
    },
    subjective: {
      type: String,
      default: '',
    },
    objective: {
      type: String,
      default: '',
    },
    assessment: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      default: '',
    },
    analyses: [
      {
        catalogId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogAnalysis' },
        name: { type: String },
        result: { type: String },
        unit: { type: String },
        status: { type: String, enum: ['Normal', 'Anormal', 'En attente'], default: 'En attente' },
      },
    ],
    radios: [
      {
        catalogId: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogRadio' },
        name: { type: String },
        notes: { type: String },
        bodyRegion: { type: String },
      },
    ],
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
