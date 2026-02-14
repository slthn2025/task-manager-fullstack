const Task = require("../models/Task");

/* =========================================
   Helper Response Function
========================================= */
const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/* =========================================
   CREATE TASK
========================================= */
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    });

    const populatedTask = await task.populate("user", "name email");

    return sendResponse(res, 201, "Task created successfully", populatedTask);
  } catch (error) {
    next(error);
  }
};

/* =========================================
   GET TASKS (Pagination + Search + Filter)
========================================= */
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const skip = (page - 1) * limit;

    let query = {
      user: req.user._id,
      title: { $regex: search, $options: "i" },
    };

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return sendResponse(res, 200, "Tasks fetched successfully", {
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================
   UPDATE TASK
========================================= */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;

    const updatedTask = await task.save();

    return sendResponse(res, 200, "Task updated successfully", updatedTask);
  } catch (error) {
    next(error);
  }
};

/* =========================================
   DELETE TASK
========================================= */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }

    await task.deleteOne();

    return sendResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};

/* =========================================
   TASK STATUS STATS
========================================= */
const getTaskStats = async (req, res, next) => {
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
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      totalTasks: 0,
      pending: 0,
      "in-progress": 0,
      completed: 0,
    };

    stats.forEach((item) => {
      formattedStats[item._id] = item.count;
      formattedStats.totalTasks += item.count;
    });

    return sendResponse(res, 200, "Task stats fetched successfully", formattedStats);
  } catch (error) {
    next(error);
  }
};

/* =========================================
   MONTHLY STATS
========================================= */
const getMonthlyStats = async (req, res, next) => {
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
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    return sendResponse(res, 200, "Monthly stats fetched successfully", stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getMonthlyStats,
};