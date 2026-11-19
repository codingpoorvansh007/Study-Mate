const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();
router.use(requireAuth); // every task route needs a valid token

const PRIORITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const DAY = 24 * 60 * 60 * 1000;

// Only these fields may be set from the request body (prevents changing userId etc.)
const pickFields = (body) => {
  const out = {};
  ['title', 'description', 'subject', 'priority', 'deadline', 'status'].forEach((k) => {
    if (body[k] !== undefined) out[k] = body[k];
  });
  return out;
};

const validateTask = (data, { partial = false } = {}) => {
  if (!partial || data.title !== undefined) {
    if (!data.title || String(data.title).trim().length < 3) return 'Title must be at least 3 characters';
  }
  if (!partial || data.subject !== undefined) {
    if (!data.subject || !String(data.subject).trim()) return 'Subject is required';
  }
  if (!partial || data.deadline !== undefined) {
    if (!data.deadline || isNaN(new Date(data.deadline).getTime())) return 'A valid deadline is required';
  }
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) return 'Invalid priority';
  if (data.status !== undefined && !STATUSES.includes(data.status)) return 'Invalid status';
  return null;
};

// GET /api/tasks  (optional filters: ?subject=&priority=&status=)
router.get('/', async (req, res) => {
  try {
    const filter = { userId: req.user.userId };
    if (req.query.subject) filter.subject = req.query.subject;
    if (PRIORITIES.includes(req.query.priority)) filter.priority = req.query.priority;
    if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks/stats  (must be declared before /:id)
router.get('/stats', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    const now = Date.now();
    const open = tasks.filter((t) => t.status !== 'Completed');
    res.json({
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      dueSoon: open.filter((t) => {
        const d = new Date(t.deadline).getTime();
        return d >= now && d - now <= 2 * DAY;
      }).length,
      overdue: open.filter((t) => new Date(t.deadline).getTime() < now).length,
      byPriority: {
        High: tasks.filter((t) => t.priority === 'High').length,
        Medium: tasks.filter((t) => t.priority === 'Medium').length,
        Low: tasks.filter((t) => t.priority === 'Low').length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const data = pickFields(req.body);
    const error = validateTask(data);
    if (error) return res.status(400).json({ error });
    const task = await Task.create({ ...data, userId: req.user.userId });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const data = pickFields(req.body);
    const error = validateTask(data, { partial: true });
    if (error) return res.status(400).json({ error });
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    Object.assign(task, data);
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!result) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
