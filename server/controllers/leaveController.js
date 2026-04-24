const LeaveRequest = require('../models/LeaveRequest.js');
const User = require('../models/User.js');
const { differenceInCalendarDays, parseISO, isBefore, isAfter, isEqual } = require('date-fns');

// Helper to check for overlapping leaves
const checkOverlap = async (userId, start, end) => {
  const overlappingRequest = await LeaveRequest.findOne({
    user: userId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ]
  });
  return overlappingRequest;
};

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private
const createLeaveRequest = async (req, res) => {
  const { startDate, endDate, leaveType, reason } = req.body;

  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (isBefore(end, start)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // totalDays calculated as inclusive days (difference + 1)
    const totalDays = differenceInCalendarDays(end, start) + 1;

    // Check Balance for Annual Leave
    if (leaveType === 'Annual') {
      const user = await User.findById(req.user._id);
      if (totalDays > user.annualLeaveBalance) {
        return res.status(400).json({ message: `Insufficient annual leave balance. Requested: ${totalDays}, Balance: ${user.annualLeaveBalance}` });
      }
    }

    // Check for overlapping leaves
    const isOverlapping = await checkOverlap(req.user._id, start, end);
    if (isOverlapping) {
      return res.status(400).json({ message: 'Leave dates overlap with an existing request' });
    }

    const leaveRequest = await LeaveRequest.create({
      user: req.user._id,
      startDate: start,
      endDate: end,
      leaveType,
      reason,
      totalDays,
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's leave requests
// @route   GET /api/leaves/my
// @access  Private
const getMyLeaves = async (req, res) => {
  const leaves = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private/Manager
const getAllLeaves = async (req, res) => {
  const leaves = await LeaveRequest.find({}).populate('user', 'id name email annualLeaveBalance').sort({ createdAt: -1 });
  res.json(leaves);
};

// @desc    Update leave status
// @route   PUT /api/leaves/:id/status
// @access  Private/Manager
const updateLeaveStatus = async (req, res) => {
  const { status, managerComments } = req.body;

  const leave = await LeaveRequest.findById(req.params.id).populate('user');

  if (!leave) {
    return res.status(404).json({ message: 'Leave request not found' });
  }

  // Prevent updating already processed leaves
  if (leave.status !== 'Pending') {
    return res.status(400).json({ message: `Leave request is already ${leave.status}` });
  }

  leave.status = status;
  leave.managerComments = managerComments || '';
  leave.reviewedAt = Date.now();

  // Deduct balance if approved and Annual
  if (status === 'Approved' && leave.leaveType === 'Annual') {
    const user = await User.findById(leave.user._id);
    if (user.annualLeaveBalance >= leave.totalDays) {
      user.annualLeaveBalance -= leave.totalDays;
      await user.save();
    } else {
       return res.status(400).json({ message: 'User does not have enough annual leave balance' });
    }
  }

  const updatedLeave = await leave.save();
  res.json(updatedLeave);
};

module.exports = {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};
