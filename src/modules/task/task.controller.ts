import { Request, Response } from "express";
import { TaskService } from "./task.service";

const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const result = await TaskService.getMyTasks(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const result = await TaskService.createTask(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const syncTodayProgress = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await TaskService.syncTodayProgress(taskId, Number(userId));
    res.status(200).json(result);
  } catch (error: any) {
    const clientErrors = [
      "Not authorized to update this task",
      "Progress can only be updated on working days",
      "No log found for today",
      "Today's log is already finalized",
      "Task not found",
    ];
    if (clientErrors.includes(error?.message)) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).send(error);
  }
};

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const result = await TaskService.getAllTasks();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const result = await TaskService.getTaskById(Number(req.params.id));
    if (!result) return res.status(404).json({ error: "Task not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const result = await TaskService.updateTask(
      Number(req.params.id),
      req.body,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    await TaskService.deleteTask(Number(req.params.id));
    res.status(200).json({ message: "Task deactivated" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const TaskController = {
  getMyTasks,
  createTask,
  updateTask,
  syncTodayProgress,
  getAllTasks,
  getTaskById,
  deleteTask,
};
