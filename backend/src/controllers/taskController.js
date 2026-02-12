const Task = require("../models/Task");


// CREATE TASK
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// GET ALL TASKS (by logged user)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
