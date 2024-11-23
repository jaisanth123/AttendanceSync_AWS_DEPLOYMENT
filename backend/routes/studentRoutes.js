const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Define the route to get roll numbers by criteria
router.get('/rollnumbers', studentController.getStudentsWithoutAttendance);

module.exports = router;
