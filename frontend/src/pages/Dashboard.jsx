import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import TaskTable from "../components/TaskTable";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===============================
     FETCH STATS
  ============================== */
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/tasks/stats");

      // Format backend baru
      setStats(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     LOADING STATE
  ============================== */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 text-center text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      </>
    );
  }

  /* ===============================
     ERROR STATE
  ============================== */
  if (error) {
    return (
      <>
        <Navbar />
        <div className="pt-24 text-center text-red-500">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-24 px-6 transition-colors duration-300">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <StatCard title="Total Tasks" value={stats.totalTasks} />

          <StatCard
            title="Pending"
            value={stats.pending}
            color="text-yellow-500"
          />

          <StatCard
            title="In Progress"
            value={stats["in-progress"]}
            color="text-blue-500"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            color="text-green-500"
          />

        </div>

        {/* Task Table Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm transition">
          <TaskTable />
        </div>

      </div>
    </>
  );
}

/* ===============================
   REUSABLE STAT CARD
============================== */
function StatCard({ title, value, color = "text-gray-500" }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm transition">
      <p className={`${color} dark:text-gray-400`}>
        {title}
      </p>
      <h2 className="text-2xl font-bold dark:text-white">
        {value}
      </h2>
    </div>
  );
}

export default Dashboard;