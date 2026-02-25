import express from "express";
import { TaskController } from "./task.controller";

const router = express.Router();

router.get("/all", TaskController.getAllTasks);
router.get("/my", TaskController.getMyTasks);
router.get("/:id", TaskController.getTaskById);
router.post("/", TaskController.createTask);
router.patch("/:id", TaskController.updateTask);
router.patch("/:taskId/progress", TaskController.syncTodayProgress);
router.delete("/:id", TaskController.deleteTask);

export const taskRouter = router;
