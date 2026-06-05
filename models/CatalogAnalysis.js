import mongoose from 'mongoose';

const catalogAnalysisSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, default: '' },
    refMin: { type: Number },
    refMax: { type: Number },
    category: { type: String, default: 'Général' },
  },
  { timestamps: true }
);

const CatalogAnalysis = mongoose.model('CatalogAnalysis', catalogAnalysisSchema);
export default CatalogAnalysis;
