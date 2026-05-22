import mongoose from 'mongoose';

const chargeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    category: {
      type: String,
      required: true,
      enum: ['Loyer', 'Électricité/Eau', 'Équipement', 'Salaires', 'Fournitures', 'Autre'],
      default: 'Autre',
    },
  },
  {
    timestamps: true,
  }
);

const Charge = mongoose.model('Charge', chargeSchema);
export default Charge;
