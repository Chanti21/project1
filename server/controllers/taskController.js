const Task = require('../models/Task');

// @desc    Get all tasks (Admin: all, Member: only assigned)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'Member') {
      filter.assignedTo = req.user._id;
    }
    if (req.query.project) {
      filter.project = req.query.project;
    }
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, dueDate, status } = req.body;
    if (!title || !description || !project || !assignedTo || !dueDate) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    const task = await Task.create({ title, description, project, assignedTo, dueDate, status });
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'project', select: 'name' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Members can only update status of their own tasks
    if (req.user.role === 'Member') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Members can only change status
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      ).populate([
        { path: 'assignedTo', select: 'name email' },
        { path: 'project', select: 'name' },
      ]);
      return res.json(updatedTask);
    }

    // Admins can update everything
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'project', select: 'name' },
    ]);
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'Member') filter.assignedTo = req.user._id;

    const tasks = await Task.find(filter);
    const now = new Date();

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const todo = tasks.filter((t) => t.status === 'Todo').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'Completed' && new Date(t.dueDate) < now
    ).length;

    res.json({ total, completed, inProgress, todo, overdue });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats };
