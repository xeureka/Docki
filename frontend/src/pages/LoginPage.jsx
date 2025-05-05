import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/users");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/signin" : "/signup";

    try {
      const response = await axios.post(
        `http://localhost:3000/auth${endpoint}`,
        formData,
        { withCredentials: true }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      alert(`${isLogin ? "Login" : "Registration"} successful!`);
      navigate("/users"); // Correct redirect path
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} error:`, error);
      alert(
        error.response?.data?.message ||
          "An error occurred. Please check your input."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Signout error:", error);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-950 p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6">
        <div className="w-full overflow-hidden border-b border-gray-700 mb-6">
          <div className="whitespace-nowrap animate-marquee text-lg font-bold tracking-wide text-indigo-400 glow-text">
            📚 Welcome to the Digital Library — Read. Learn. Grow. 📖 &nbsp; 📚
            Welcome to the Digital Library — Read. Learn. Grow. 📖
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {isLogin ? "Please login to your account" : "Register to get started"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-sm text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="ml-1 text-blue-400 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full text-red-500 text-sm mt-2 hover:underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
