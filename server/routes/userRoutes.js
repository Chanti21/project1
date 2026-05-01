const express = require('express');
const router = express.Router();
const { getUsers, getUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', protect, authorize('Admin'), getUsers);
router.get('/:id', protect, authorize('Admin'), getUser);

module.exports = router;
