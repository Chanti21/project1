const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, createProject, updateProject,
  deleteProject, addMember, removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, authorize('Admin'), createProject);
router.put('/:id', protect, authorize('Admin'), updateProject);
router.delete('/:id', protect, authorize('Admin'), deleteProject);
router.post('/:id/members', protect, authorize('Admin'), addMember);
router.delete('/:id/members/:userId', protect, authorize('Admin'), removeMember);

module.exports = router;
