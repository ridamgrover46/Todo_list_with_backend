import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todo-list-with-backend-3.onrender.com/api/auth/login",
        { email, password }
      );

      // Save token in localStorage
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/todos"); // ✅ Redirect to todos
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-2 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
