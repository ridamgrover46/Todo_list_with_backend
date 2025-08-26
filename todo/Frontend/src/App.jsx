import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left side - Logo/Heading */}
        <h1 className="text-2xl font-bold tracking-wide">✅ Daily Tasks</h1>

        {/* Right side - Buttons */}
        <div className="flex gap-4">
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-green-500 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-green-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    axios.get("https://todo-list-with-backend-3.onrender.com/api/todos")
      .then((res) => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await axios.post("https://todo-list-with-backend-3.onrender.com/api/todos", { text });
    setTodos([...todos, res.data]);
    setText("");
  };

  const toggleComplete = async (id, completed) => {
    const res = await axios.put(`https://todo-list-with-backend-3.onrender.com/api/todos/${id}`, {
      completed: !completed,
    });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await axios.delete(`https://todo-list-with-backend-3.onrender.com/api/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    const res = await axios.put(`https://todo-list-with-backend-3.onrender.com/api/todos/${id}`, {
      text: editText,
    });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        {/* Add Todo */}
        <div className="flex mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-5 py-2 rounded-r-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">
              {completedCount} of {todos.length} tasks completed
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${(completedCount / todos.length) * 100 || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-lg border font-medium transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <ul className="space-y-3">
          <AnimatePresence>
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <motion.li
                  key={todo._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  {editingId === todo._id ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => saveEdit(todo._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span
                        onClick={() => toggleComplete(todo._id, todo.completed)}
                        className={`flex-1 cursor-pointer ${
                          todo.completed ? "line-through text-gray-500" : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(todo._id, todo.text)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  {todo.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Added on {new Date(todo.createdAt).toLocaleString()}
                    </p>
                  )}
                </motion.li>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-600"
              >
                🎉 No tasks yet. Add your first one!
              </motion.p>
            )}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<TodoApp />} />
      </Routes>
    </Router>
  );
}

export default App;
