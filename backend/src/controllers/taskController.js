const Task = require("../models/Task");


// CREATE TASK
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    });

    const populatedTask = await task.populate("user", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// GET ALL TASKS (by logged user)
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const status = req.query.status;

    const skip = (page - 1) * limit;

    // Query filter
    let query = {
      user: req.user._id,
      title: { $regex: search, $options: "i" }, // case insensitive
    };

    if (status) {
      query.status = status;
    }
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (startDate && endDate) {
    query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
    };
    }

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });

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


const getTaskStats = async (req, res) => {
  try {

    let matchStage = {};

    if (req.user.role !== "admin") {
      matchStage.user = req.user._id;
    }

    const stats = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      totalTasks: 0,
      pending: 0,
      "in-progress": 0,
      completed: 0
    };

    stats.forEach(item => {
      formattedStats[item._id] = item.count;
      formattedStats.totalTasks += item.count;
    });

    res.json(formattedStats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMonthlyStats = async (req, res) => {
  try {

    let matchStage = {};

    if (req.user.role !== "admin") {
      matchStage.user = req.user._id;
    }

    const stats = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getMonthlyStats
};
