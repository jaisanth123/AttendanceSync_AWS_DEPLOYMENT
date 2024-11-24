const express = require('express');
const {handleAbsentStudentsReport, generateAbsentStudentsMessage } = require('../controllers/reportController');

const router = express.Router();

// Define the route to generate the absent students' message
router.get('/absentStudents', generateAbsentStudentsMessage);

// Route for generating report for male students
router.get('/reportabsent/male', (req, res) => {
    handleAbsentStudentsReport('MALE', req, res);
});

// Route for generating report for female students
router.get('/reportabsent/female', (req, res) => {
    handleAbsentStudentsReport('FEMALE', req, res);
});
module.exports = router;// Route for generating report for female students
