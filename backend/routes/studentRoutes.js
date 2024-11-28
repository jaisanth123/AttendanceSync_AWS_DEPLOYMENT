const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');


// Define the route to get roll numbers by criteria
router.get('/rollnumbers', attendanceController.fetchRemainingStudents);

module.exports = router;
