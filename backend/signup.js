const mongoose = require('mongoose');
const User = require('./models/userSchema.js');
const Admin = require('./models/adminSchema.js');


// Connect to your MongoDB database
mongoose.connect('', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error:', err));

// Create a User
const createUser = async () => {
  try {
    const user = new User({
      name: 'User Name',
      username: 'user123',  // Make sure 'username' is unique in your DB
      password: 'userpassword123',
    });

    await user.save();
    console.log('User created:', user);
  } catch (error) {
    console.log('Error creating user:', error);
  }
};

// Create an Admin
const createAdmin = async () => {
  try {
    const admin = new Admin({
      name: 'Admin Name',
      username: 'admin123',  // Make sure 'username' is unique in your DB
      password: 'adminpassword123',
    });

    await admin.save();
    console.log('Admin created:', admin);
  } catch (error) {
    console.log('Error creating admin:', error);
  }
};

// Call the functions to create the user and admin
createUser();
createAdmin();
