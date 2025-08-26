import { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://todo-list-with-backend-3.onrender.com/api/auth/register", { username, email, password });
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full mb-2 p-2 border rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 p-2 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full mb-2 p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Register;
