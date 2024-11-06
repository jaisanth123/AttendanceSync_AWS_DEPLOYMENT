const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get students by section
router.get('/:section', async (req, res) => {
  try {
    const students = await Student.find({ section: req.params.section });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
