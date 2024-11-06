const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  rollNo: String,
  status: { type: String, enum: ['Present', 'Absent', 'On Duty'] },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
