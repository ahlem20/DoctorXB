import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maclinic';
    console.log('Connecting to primary database server...');
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Primary Database connection failed: ${error.message}`);
    console.log('Attempting local MongoDB fallback connection (mongodb://127.0.0.1:27017/maclinic)...');
    try {
      const localURI = 'mongodb://127.0.0.1:27017/maclinic';
      const conn = await mongoose.connect(localURI);
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    } catch (localError) {
      console.error(`Local MongoDB connection also failed: ${localError.message}`);
      console.error('\n========================================================================');
      console.error('DATABASE CONNECTIVITY ERROR:');
      console.error('1. Make sure your current IP address is whitelisted on your Atlas cluster.');
      console.error('2. Or, ensure MongoDB is installed and running locally on port 27017.');
      console.error('========================================================================\n');
      process.exit(1);
    }
  }
};

export default connectDB;
