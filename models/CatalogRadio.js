import mongoose from 'mongoose';

const catalogRadioSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    bodyRegion: { type: String, default: '' },
    category: { type: String, default: 'Radiologie' },
  },
  { timestamps: true }
);

const CatalogRadio = mongoose.model('CatalogRadio', catalogRadioSchema);
export default CatalogRadio;
