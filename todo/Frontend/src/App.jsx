import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/todos").then((res) => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await axios.post("http://localhost:5000/api/todos", { text });
    setTodos([...todos, res.data]);
    setText("");
  };

  const toggleComplete = async (id, completed) => {
    const res = await axios.put(`http://localhost:5000/api/todos/${id}`, {
      completed: !completed,
    });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    const res = await axios.put(`http://localhost:5000/api/todos/${id}`, {
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
    <div className={`${dark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-r from-pink-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-8 w-full max-w-lg">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <h1 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
            ✅ MERN Todo App
          </h1>

          {/* Add Todo */}
          <div className="flex mb-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Enter task..."
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={addTodo}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          {/* Progress Bar */}
          {todos.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {completedCount} of {todos.length} tasks completed
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${(completedCount / todos.length) * 100 || 0}%`,
                  }}
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
                className={`px-4 py-1 rounded-lg border ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white"
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
                    className="flex flex-col bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm"
                  >
                    {editingId === todo._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
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
                          onClick={() =>
                            toggleComplete(todo._id, todo.completed)
                          }
                          className={`flex-1 cursor-pointer ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
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

                    {/* Date */}
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
                  className="text-center text-gray-600 dark:text-gray-400"
                >
                  🎉 No tasks yet. Add your first one!
                </motion.p>
              )}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
