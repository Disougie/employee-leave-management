const User = require('../models/User.js');

// @desc    Register a new employee
// @route   POST /api/users
// @access  Private/Manager
const registerEmployee = async (req, res) => {
  const { name, email, password, phone, annualLeaveBalance } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'Employee',
    phone,
    annualLeaveBalance: annualLeaveBalance || 21,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      annualLeaveBalance: user.annualLeaveBalance,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get all users (employees)
// @route   GET /api/users
// @access  Private/Manager
const getUsers = async (req, res) => {
  const users = await User.find({ role: 'Employee' }).select('-password');
  res.json(users);
};

module.exports = {
  registerEmployee,
  getUsers,
};
