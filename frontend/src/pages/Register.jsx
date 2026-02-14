import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess(response.data.message);

      // Redirect ke login setelah 1.5 detik
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
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
          Create Account
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-500 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-3 border rounded-lg 
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-800 dark:text-white"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg 
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-800 dark:text-white"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg 
                       bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600
                       text-gray-800 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white p-3 rounded-lg 
                       hover:bg-green-600 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;