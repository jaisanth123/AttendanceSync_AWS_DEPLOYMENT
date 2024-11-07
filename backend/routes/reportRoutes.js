const express = require('express');
const { generateAbsentStudentsMessage } = require('../controllers/reportController');

const router = express.Router();

// Define the route to generate the absent students' message
router.get('/absentStudents', generateAbsentStudentsMessage);

module.exports = router;
