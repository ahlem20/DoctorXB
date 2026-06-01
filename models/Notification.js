import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['arrival', 'prescription', 'appointment', 'general'],
      default: 'general',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means broadcast to all staff
    },
    targetRole: {
      type: String,
      enum: ['Doctor', 'Nurse', 'Receptionist', null],
      default: null, // null means broadcast to all staff
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
