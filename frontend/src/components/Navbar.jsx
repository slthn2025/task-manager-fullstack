import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  /* ===============================
     LOAD THEME
  ============================== */
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark((prev) => !prev);
  };

  /* ===============================
     FETCH PROFILE
  ============================== */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/users/profile");

      // Backend baru -> data ada di response.data.data
      setUser(response.data.data);
    } catch (error) {
      // Tidak perlu redirect manual jika sudah pakai interceptor 401
      console.error(error);
    }
  };

  /* ===============================
     LOGOUT
  ============================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="fixed top-0 left-0 w-full 
                 bg-white/80 dark:bg-gray-900/80
                 backdrop-blur-md shadow-md
                 border-b border-gray-200 dark:border-gray-700
                 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Task Manager
        </h2>

        <div className="flex items-center gap-4">

          {user && (
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              👋 {user.name}
            </span>
          )}

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl border
                       border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100
                       dark:hover:bg-gray-700
                       transition"
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

export default Navbar;