const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Mark students as On Duty
router.post('/on-duty', async (req, res) => {
  const { rollNos } = req.body;
  const date = new Date();

  try {
    await Attendance.updateMany(
      { rollNo: { $in: rollNos }, date },
      { $set: { status: 'On Duty' } },
      { upsert: true }
    );
    res.json({ message: 'Marked On Duty' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark students as Absent
router.post('/absent', async (req, res) => {
  const { rollNos } = req.body;
  const date = new Date();

  try {
    await Attendance.updateMany(
      { rollNo: { $in: rollNos }, date },
      { $set: { status: 'Absent' } },
      { upsert: true }
    );

    // Mark others as Present
    await Attendance.updateMany(
      { rollNo: { $nin: rollNos }, date },
      { $set: { status: 'Present' } },
      { upsert: true }
    );

    res.json({ message: 'Marked Absent and Present' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
