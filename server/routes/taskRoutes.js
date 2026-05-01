const express = require('express');
const router = express.Router();
const {
  getTasks, getTask, createTask, updateTask, deleteTask, getStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/stats', protect, getStats);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, authorize('Admin'), createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, authorize('Admin'), deleteTask);

module.exports = router;
