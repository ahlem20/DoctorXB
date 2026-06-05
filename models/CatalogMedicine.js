import mongoose from 'mongoose';

const catalogMedicineSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Général' },
  },
  { timestamps: true }
);

const CatalogMedicine = mongoose.model('CatalogMedicine', catalogMedicineSchema);
export default CatalogMedicine;
