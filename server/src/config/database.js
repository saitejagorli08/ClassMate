import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers, using system default:', e.message);
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!uri) {
    console.error('❌ MONGODB_URI or MONGO_URI is missing from environment variables!');
    console.error('👉 Please add MONGODB_URI in your Render / hosting environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'student_management',
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
