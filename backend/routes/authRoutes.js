const express = require('express');
const { loginUser, loginAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/login/user', loginUser);
router.post('/login/admin', loginAdmin);

module.exports = router;
