const express = require('express');
const { generateAbsentStudentsMessage,handleDownloadAbsentReport,handleCustomDownloadAbsentReport } = require('../controllers/reportController');

const router = express.Router();

// Define the route to generate the absent students' message
router.get('/absentStudents', generateAbsentStudentsMessage);


router.get('/downloadreport/male', (req, res) => {
    handleDownloadAbsentReport('MALE', req, res);
});

router.get('/downloadreport/female', (req, res) => {
    handleDownloadAbsentReport('FEMALE', req, res);
});

router.get('/download-absent-report', handleCustomDownloadAbsentReport);

module.exports = router;// Route for generating report for female students
