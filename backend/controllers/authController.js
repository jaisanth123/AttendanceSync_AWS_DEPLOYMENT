const User = require('../models/userSchema');
const Admin = require('../models/adminSchema');
const { sendToken } = require('../utils/jwtToken');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  sendToken(user, 200, res, 'User logged in successfully');
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordMatch = await admin.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  sendToken(admin, 200, res, 'Admin logged in successfully');
};

module.exports = { loginUser, loginAdmin };
