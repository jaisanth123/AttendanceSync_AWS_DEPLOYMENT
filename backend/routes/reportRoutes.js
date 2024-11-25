const express = require('express');
const {handleAbsentStudentsReport, generateAbsentStudentsMessage,handleDownloadAbsentReport,handleCustomDownloadAbsentReport } = require('../controllers/reportController');

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

router.get('/downloadreport/male', (req, res) => {
    handleDownloadAbsentReport('MALE', req, res);
});

router.get('/downloadreport/female', (req, res) => {
    handleDownloadAbsentReport('FEMALE', req, res);
});

router.get('/download-absent-report', handleCustomDownloadAbsentReport);

module.exports = router;// Route for generating report for female students
