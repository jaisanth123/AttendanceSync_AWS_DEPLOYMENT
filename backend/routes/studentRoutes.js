const express = require('express');
const router = express.Router();
const sample = require('../models/Student');
// Fetch students by year, branch, and section

router.get('/:year/:branch/:section', async (req, res) => {
  const { year, branch, section } = req.params;

  try {
      // Query to find students by yearOfStudy, branch, and section
      const students = await sample.find({ year, branch, section });
      res.json(students);
  } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: 'Failed to fetch students' });
  }
});
module.exports = router;
