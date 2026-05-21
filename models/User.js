import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Doctor', 'Nurse', 'Receptionist'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    permissions: {
      viewFinance: {
        type: Boolean,
        default: false,
      }
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
