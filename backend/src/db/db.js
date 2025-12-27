import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { env } from '../config/env.js';

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  try {
    const connectionInstance = await mongoose.connect(`${env.mongoUri}/${DB_NAME}`);
    console.log(`✅ MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error', error);
    process.exit(1);
  }
};

export default connectDB;
