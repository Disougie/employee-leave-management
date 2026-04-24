const express = require('express');
const router = express.Router();
const { createLeaveRequest, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController.js');
const { protect, manager } = require('../middleware/auth.js');

router.route('/').post(protect, createLeaveRequest).get(protect, manager, getAllLeaves);
router.route('/my').get(protect, getMyLeaves);
router.route('/:id/status').put(protect, manager, updateLeaveStatus);

module.exports = router;
