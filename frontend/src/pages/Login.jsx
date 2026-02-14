import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    const token = response.data.data.token;
    localStorage.setItem("token", token);

    navigate("/dashboard");
  } catch (err) {
    setError(
      err.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      <div className="bg-white dark:bg-gray-800 
                      p-8 rounded-2xl shadow-lg w-96 transition">

        <h2 className="text-2xl font-bold mb-6 text-center 
                       text-gray-800 dark:text-white">
          Task Manager Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg 
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg 
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-800 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg 
                       hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>

        </form>
      </div>
    </div>
  );
}

export default Login;