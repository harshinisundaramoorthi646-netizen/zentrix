import mongoose from 'mongoose';

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : '';

  if (uri && uri.includes('#') && uri.includes('@')) {
    uri = uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, (match, prefix, pass, suffix) => {
      return prefix + pass.replace(/#/g, '%23') + suffix;
    });
  }

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in environment. Running backend in Standalone In-Memory Mode.');
    return false;
  }

  if (process.env.DISCONNECT_DB === 'true') {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    console.log('ℹ️ Database disconnected per configuration. Running in Standalone In-Memory Mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`🍃 MongoDB Atlas Connected Successfully! Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    // Sanitize error message to prevent accidental credential leakage in logs
    const sanitizedMsg = (error.message || '').replace(/:[^@]+@/, ':****@');
    console.error(`❌ MongoDB Atlas Connection Error: ${sanitizedMsg}`);
    console.warn('⚠️ Falling back to Standalone In-Memory Mode.');
    return false;
  }
};
