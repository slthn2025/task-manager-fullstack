import { useEffect, useState } from "react";
import API from "../api/axios";

function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    status: "pending",
  });

  const [editId, setEditId] = useState(null);

  /* ===============================
     FETCH TASKS
  ============================== */
  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/tasks", {
        params: { page, search },
      });

      setTasks(response.data.data.tasks);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     SUBMIT TASK
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (editId) {
        const response = await API.put(`/tasks/${editId}`, formData);

        const updatedTask = response.data.data;

        setTasks((prev) =>
          prev.map((task) =>
            task._id === editId ? updatedTask : task
          )
        );
      } else {
        const response = await API.post("/tasks", formData);

        const newTask = response.data.data;

        setTasks((prev) => [newTask, ...prev]);
      }

      setShowModal(false);
      setFormData({ title: "", status: "pending" });
      setEditId(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE TASK
  ============================== */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err);
    }
  };

  /* ===============================
     EDIT TASK
  ============================== */
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      status: task.status,
    });
    setEditId(task._id);
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 
                      rounded-2xl shadow-sm 
                      border border-gray-100 dark:border-gray-700 
                      p-6 transition-colors duration-300">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Your Task
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search task..."
              className="border border-gray-200 dark:border-gray-600
                         bg-white dark:bg-gray-700
                         text-gray-800 dark:text-white
                         px-4 py-2 rounded-xl outline-none transition"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 
                         text-white px-5 py-2 
                         rounded-xl transition shadow-sm"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="text-left font-medium">Status</th>
                  <th className="text-left font-medium">User</th>
                  <th className="text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b dark:border-gray-700
                               hover:bg-gray-50 dark:hover:bg-gray-700
                               transition"
                  >
                    <td className="py-4 font-medium text-gray-800 dark:text-white">
                      {task.title}
                    </td>

                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                        {task.status}
                      </span>
                    </td>

                    <td className="text-gray-600 dark:text-gray-300">
                      {task.user?.name || "-"}
                    </td>

                    <td className="py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tasks.length === 0 && (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                No tasks found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                        flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 
                          text-gray-800 dark:text-white
                          rounded-2xl p-8 w-96 shadow-xl">

            <h3 className="text-xl font-semibold mb-6">
              {editId ? "Edit Task" : "Create Task"}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border border-gray-200 dark:border-gray-600
                           bg-white dark:bg-gray-700
                           text-gray-800 dark:text-white
                           px-4 py-2 rounded-xl outline-none transition"
                required
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border border-gray-200 dark:border-gray-600
                           bg-white dark:bg-gray-700
                           text-gray-800 dark:text-white
                           px-4 py-2 rounded-xl outline-none transition"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                  className="px-4 py-2 border 
                             border-gray-300 dark:border-gray-600
                             rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 
                             hover:bg-blue-700 
                             text-white rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default TaskTable;