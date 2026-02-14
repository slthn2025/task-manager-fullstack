import { useEffect, useState } from "react";

function TaskModal({ isOpen, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "pending",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        status: editData.status,
      });
    } else {
      setFormData({ title: "", status: "pending" });
    }
  }, [editData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-96 shadow-xl transition">

        <h3 className="text-xl font-semibold mb-6 dark:text-white">
          {editData ? "Edit Task" : "Create Task"}
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border px-4 py-2 rounded-xl"
            required
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border px-4 py-2 rounded-xl"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default TaskModal;