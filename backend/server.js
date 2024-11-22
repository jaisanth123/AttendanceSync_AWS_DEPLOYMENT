// app.js
const express = require('express');
const connectDB = require('./dbConnection'); // Import the database connection function

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportRoutes = require('./routes/reportRoutes');
//const excelReportRoutes = require('./routes/excelReportRoutes');


app.use('/api/students', studentRoutes);
app.use('/api/attendance',attendanceRoutes);
app.use('/api/report', reportRoutes);
//app.use('/api/excel', excelReportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});