// dbConnection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// MongoDB URI from MongoDB Atlas
const uri =  `mongodb+srv://deployUser:${process.env.MONGO_PASSWORD}@cluster0.sfj4f.mongodb.net/AI_Attendence?retryWrites=true`;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
