const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User.js');
const LeaveRequest = require('./models/LeaveRequest.js');
const connectDB = require('./config/db.js');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await LeaveRequest.deleteMany();

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@system.com',
      password: 'admin',
      role: 'Manager',
      annualLeaveBalance: 0,
    });

    await adminUser.save();

    console.log('Data Imported - Initial Admin created!');
    process.exit();
  } catch (error) {
    console.error(`Error with seed: ${error}`);
    process.exit(1);
  }
};

importData();
