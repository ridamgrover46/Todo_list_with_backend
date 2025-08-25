require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());


// Debug check
console.log("MONGO_URI:", process.env.MONGO_URI);  // 👈 should print URI

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema & Model
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model("Todo", TodoSchema);

// Routes
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const newTodo = new Todo({ text: req.body.text });
  await newTodo.save();
  res.json(newTodo);
});

app.put("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text, completed: req.body.completed },
    { new: true }
  );
  res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
