import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await User.create([
      {
        name: 'Dr. Smith',
        email: 'doctor@maclinic.com',
        password: hashedPassword,
        role: 'Doctor',
      },
      {
        name: 'Nurse Amina',
        email: 'nurse@maclinic.com',
        password: hashedPassword,
        role: 'Nurse',
      },
      {
        name: 'Receptionist Sarah',
        email: 'receptionist@maclinic.com',
        password: hashedPassword,
        role: 'Receptionist',
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
