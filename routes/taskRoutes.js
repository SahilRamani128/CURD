const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/user'); 

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, assignedUsers } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newTask = new Task({
      title,
      description,
      assignedUsers
    });
    await newTask.save();

    res.status(201).json({ success: true, message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUsers', 'name');
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
});

router.put('/assign', authMiddleware, async (req, res) => {
  const { taskId, userIds } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.assignedUsers = userIds;
    await task.save();

    res.status(200).json({ success: true, message: 'Users assigned to task successfully', task });
  } catch (error) {
    console.error('Error assigning users to task:', error);
    res.status(500).json({ success: false, message: 'Failed to assign users to task' });
  }
});

module.exports = router;
