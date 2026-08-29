import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '' || process.env.DISCONNECT_DB === 'true') {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    console.log('ℹ️ Database disconnected. Running backend in Standalone In-Memory Mode.');
    return false;
  }

  const primaryUri = uri;
  const localUri = 'mongodb://127.0.0.1:27017/zentrix_db';


  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB Connection Error (${error.message}). Trying local fallback...`);
    if (primaryUri !== localUri) {
      try {
        const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
        console.log(`🍃 Local MongoDB Connected: ${conn.connection.host}`);
        return true;
      } catch (localErr) {
        console.error(`❌ Local MongoDB Connection Error: ${localErr.message}`);
      }
    }
    console.warn('⚠️ Falling back to Standalone In-Memory Mode.');
    return false;
  }
};


