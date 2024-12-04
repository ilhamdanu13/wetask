import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

export const creatTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Title is required!" });
    }

    if (!description || description.trim() === "") {
      res.status(400).json({ message: "Description is required!" });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.log(error);
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({ length: tasks.length, tasks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    if (id === "undefined") {
      res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed || task.completed;

    await task.save();
    res.status(200).json({ message: "Task updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
    }

    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});