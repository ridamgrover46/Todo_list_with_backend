import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://todo-list-with-backend-3.onrender.com/api/auth/register",
        { username, email, password }
      );

      toast.success(res.data.message || "Registration successful 🎉", {
        position: "top-right",
      });

      setTimeout(() => navigate("/login"), 1500); // redirect after toast
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleRegister} 
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          className="w-full mb-2 p-2 border rounded" 
        />
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
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
      {/* ✅ Toastify container */}
      <ToastContainer />
    </div>
  );
}

export default Register;
