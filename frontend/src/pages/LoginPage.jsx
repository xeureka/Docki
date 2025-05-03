import { useState } from "react";

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isLogin ? "Logging in" : "Registering";
    console.log(action, formData);
    // TODO: integrate with backend
  };

  return (

    

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">



      <div className="bg-gray-950 p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6">
      <div className="w-full overflow-hidden border-b border-gray-700 mb-6">
        <div className="whitespace-nowrap animate-marquee text-lg font-bold tracking-wide text-indigo-400 glow-text">
          📚 Welcome to the Digital Library — Read. Learn. Grow. 📖 &nbsp; 📚 Welcome to the Digital Library — Read. Learn. Grow. 📖
        </div>
        
      </div>
        <h1 className="text-3xl font-bold text-center">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="text-sm text-gray-400 text-center">
          {isLogin ? "Please login to your account" : "Register to get started"}
        </p>



        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
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
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline mt-1"
          >
            {isLogin ? "Register here" : "Login instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
