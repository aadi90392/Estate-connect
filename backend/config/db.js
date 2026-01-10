const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB se connect karne ki koshish
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Agar connect nahi hua to process band kar do
  }
};

module.exports = connectDB;