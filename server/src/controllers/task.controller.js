import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/Task.model.js";
const createNewTask= asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(403, "You are not authenticated");
  }

  const { content, listId } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "content is required");
  }

  const newTask = await Task.create({
    content,
    owner: req.user._id,
    list: listId,   
  });

  res.status(200).json(new ApiResponse(200, newTask, "Task successfully created"));
});

const toggleTaskCompletion = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "You are not authenticated");
    }
    
    const { taskId } = req.params;
    
    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }
    
    const task = await Task.findById(taskId);
    
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    
    if (task.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this task");
    }
    
    task.isCompleted = !task.isCompleted;
    await task.save();
    
    res.status(200).json(new ApiResponse(200, task, "Task completion status toggled"));
});

const deleteTask = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "You are not authenticated");
    }
    
    const { taskId } = req.params;
    
    if (!taskId) {
        throw new ApiError(400, "Task ID is required");
    }
    
    const task = await Task.findById(taskId);
    
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    
    if (task.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this task");
    }
    
    await task.deleteOne();
    
    res.status(200).json(new ApiResponse(200, null, "Task successfully deleted"));
}
);

const updateTaskContent = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(403, "You are not authenticated");
    }
    
    const { taskId } = req.params;
    const { content } = req.body;
    
    if (!taskId || !content || content.trim() === "") {
        throw new ApiError(400, "Task ID and content are required");
    }
    
    const task = await Task.findById(taskId);
    
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    
    if (task.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this task");
    }
    
    task.content = content;
    await task.save();
    
    res.status(200).json(new ApiResponse(200, task, "Task successfully updated"));
});

export {
  createNewTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskContent,
};