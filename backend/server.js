const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://krrashmika2004:vppCejSTFgfm51dn@cluster0.9cpfc.mongodb.net/Attendence_Monitering?retryWrites=true&w=majority'
);


// Check for successful connection
mongoose.connection.once('open', () => {
  console.log('Connected to the database successfully');
});

// Handle connection errors
mongoose.connection.on('error', (error) => {
  console.error('Database connection error:', error);
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);


app.listen(8000,()=>{
  console.log('😁👍')
})
