import { Router } from "express";
import {
  createNewTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskContent,
} from "../controllers/task.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);
router.post("/", createNewTask);
router.patch("/:taskId/toggle", toggleTaskCompletion);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/content", updateTaskContent);

export default router;