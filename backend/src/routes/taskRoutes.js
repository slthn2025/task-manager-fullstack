const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getMonthlyStats
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

router.get("/stats", protect, getTaskStats);
router.get("/monthly-stats", protect, getMonthlyStats);

router.route("/")
  .post(protect, createTask)
  .get(protect, getTasks);

router.route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);



module.exports = router;
