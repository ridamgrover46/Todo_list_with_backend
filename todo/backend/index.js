const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Debug check
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// ===== Todo Schema & Model (user-scoped) =====
const TodoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to owner
  },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", TodoSchema);

// ===== Todo Routes (Protected) =====

// Get current user's todos
app.get("/api/todos", authMiddleware, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
});

// Create todo for current user
app.post("/api/todos", authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Text is required" });
  }
  const newTodo = new Todo({ text: text.trim(), user: req.user.id });
  await newTodo.save();
  res.json(newTodo);
});

// Update todo (only if it belongs to current user)
app.put("/api/todos/:id", authMiddleware, async (req, res) => {
  const update = {};
  if (typeof req.body.text !== "undefined") update.text = req.body.text;
  if (typeof req.body.completed !== "undefined") update.completed = req.body.completed;

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    update,
    { new: true }
  );

  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// Delete todo (only if it belongs to current user)
app.delete("/api/todos/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Deleted" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
