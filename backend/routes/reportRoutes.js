const express = require('express');
const { generateAbsentStudentsMessage,generateAbsentMaleStudents,generateAbsentFemaleStudents } = require('../controllers/reportController');

const router = express.Router();

// Define the route to generate the absent students' message
router.get('/absentStudents', generateAbsentStudentsMessage);

// Route to get absent male students
router.get('/absent/male', generateAbsentMaleStudents);

// Route to get absent female students
router.get('/absent/female', generateAbsentFemaleStudents);

module.exports = router;
