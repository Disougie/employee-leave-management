const express = require('express');
const router = express.Router();
const { registerEmployee, getUsers } = require('../controllers/userController.js');
const { protect, manager } = require('../middleware/auth.js');

router.route('/').post(protect, manager, registerEmployee).get(protect, manager, getUsers);

module.exports = router;
