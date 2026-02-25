import { TaskStatus } from "@prisma/client";
import { prisma } from "../../config/db";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns true for Sun–Thu; false for Fri (5) and Sat (6) */
function isWorkingDay(date: Date): boolean {
  const day = date.getUTCDay();
  return day !== 5 && day !== 6;
}

/** Strips time, returns UTC midnight for the given date */
function getDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

/** Returns every working day in [from, to) */
function getWorkingDaysBetween(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(getDateOnly(from));
  const end = getDateOnly(to);

  while (cursor < end) {
    if (isWorkingDay(cursor)) {
      days.push(new Date(cursor));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

/** Counts contacts created by a user on a specific UTC day */
async function countContactsForDay(
  userId: number,
  date: Date,
): Promise<number> {
  const dayStart = getDateOnly(date);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  return prisma.contact.count({
    where: {
      authorId: userId,
      createdAt: { gte: dayStart, lt: dayEnd },
    },
  });
}

// ─── Finalize & Backfill ────────────────────────────────────────────────────

/**
 * For a single task:
 *  1. Backfill any working days between task start and today that have no log.
 *  2. Finalize any existing unfinalized logs (performance === null, date < today).
 */
async function finalizeAndBackfill(
  taskId: number,
  targetValue: number,
  taskCreatedAt: Date,
  assignedToId: number,
): Promise<void> {
  const today = getDateOnly(new Date());

  await prisma.$transaction(async (tx) => {
    // Fetch all logs before today
    const existingLogs = await tx.taskDailyLog.findMany({
      where: {
        taskId,
        date: { lt: today },
      },
      select: { id: true, date: true, achieved: true, performance: true },
    });

    const existingDates = new Set(
      existingLogs.map((l) => l.date.toISOString()),
    );

    // Working days that should exist
    const expectedDays = getWorkingDaysBetween(taskCreatedAt, today);

    // ── 1. Backfill missing days from contact count ───────────────────────
    const missingDays = expectedDays.filter(
      (d) => !existingDates.has(d.toISOString()),
    );

    for (const date of missingDays) {
      const achieved = await countContactsForDay(assignedToId, date);
      const performance = (achieved / targetValue) * 100;
      const status =
        achieved >= targetValue ? TaskStatus.COMPLETED : TaskStatus.FAILED;

      await tx.taskDailyLog.create({
        data: { taskId, date, targetValue, achieved, performance, status },
      });
    }

    // ── 2. Finalize existing unfinalized logs with contact count ──────────
    const unfinalized = existingLogs.filter((l) => l.performance === null);

    for (const log of unfinalized) {
      const achieved = await countContactsForDay(assignedToId, log.date);
      const performance = (achieved / targetValue) * 100;
      const status =
        achieved >= targetValue ? TaskStatus.COMPLETED : TaskStatus.FAILED;

      await tx.taskDailyLog.update({
        where: { id: log.id },
        data: { achieved, performance, status },
      });
    }
  });
}

// ─── Ensure Today's Log ─────────────────────────────────────────────────────

async function ensureTodayLog(
  taskId: number,
  targetValue: number,
  assignedToId: number,
): Promise<void> {
  const today = getDateOnly(new Date());

  if (!isWorkingDay(new Date())) return;

  // Count contacts created today by the assigned user
  const achieved = await countContactsForDay(assignedToId, today);
  const status =
    achieved >= targetValue ? TaskStatus.COMPLETED : TaskStatus.PENDING;

  await prisma.taskDailyLog.upsert({
    where: { taskId_date: { taskId, date: today } },
    create: {
      taskId,
      date: today,
      targetValue,
      achieved,
      status,
    },
    update: {
      achieved,
      status,
    },
  });
}

// ─── Service Functions ───────────────────────────────────────────────────────

const getMyTasks = async (userId: number) => {
  const tasks = await prisma.task.findMany({
    where: { assignedToId: userId, isActive: true },
    include: {
      assignedBy: { select: { id: true, name: true, email: true } },
    },
  });

  const today = getDateOnly(new Date());

  // Finalize past days and ensure today's log for every active task
  for (const task of tasks) {
    await finalizeAndBackfill(
      task.id,
      task.targetValue,
      task.createdAt,
      task.assignedToId,
    );
    await ensureTodayLog(task.id, task.targetValue, task.assignedToId);
  }

  // Return tasks with today's log attached
  return prisma.task.findMany({
    where: { assignedToId: userId, isActive: true },
    include: {
      assignedBy: { select: { id: true, name: true, email: true } },
      dailyLogs: {
        where: { date: today },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const createTask = async (payload: {
  title: string;
  description?: string;
  targetValue: number;
  assignedById: number;
  assignedToId: number;
}) => {
  return prisma.task.create({
    data: payload,
    include: {
      assignedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
};

/**
 * Syncs today's achieved count from the number of contacts
 * created by the assigned user on today's date.
 */
const syncTodayProgress = async (taskId: number, userId: number) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) throw new Error("Task not found");
  if (task.assignedToId !== userId)
    throw new Error("Not authorized to update this task");
  if (!isWorkingDay(new Date()))
    throw new Error("Progress can only be updated on working days");

  const today = getDateOnly(new Date());

  const log = await prisma.taskDailyLog.findUnique({
    where: { taskId_date: { taskId, date: today } },
  });

  if (!log) throw new Error("No log found for today");
  if (log.performance !== null)
    throw new Error("Today's log is already finalized");

  const achieved = await countContactsForDay(userId, today);
  const status =
    achieved >= task.targetValue ? TaskStatus.COMPLETED : TaskStatus.PENDING;

  return prisma.taskDailyLog.update({
    where: { id: log.id },
    data: { achieved, status },
  });
};

const getAllTasks = async () => {
  return prisma.task.findMany({
    include: {
      assignedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      dailyLogs: {
        orderBy: { date: "desc" },
        take: 7,
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getTaskById = async (id: number) => {
  return prisma.task.findUnique({
    where: { id },
    include: {
      assignedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      dailyLogs: { orderBy: { date: "desc" } },
    },
  });
};

const updateTask = async (
  id: number,
  payload: {
    title?: string;
    description?: string;
    targetValue?: number;
    assignedToId?: number;
    isActive?: boolean;
  },
) => {
  return prisma.task.update({
    where: { id },
    data: payload,
    include: {
      assignedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
};

const deleteTask = async (id: number) => {
  return prisma.task.update({
    where: { id },
    data: { isActive: false },
  });
};

/**
 * Called internally after a contact is created.
 * Finds all active tasks assigned to this user and syncs today's achieved
 * count from the Contact table. No manual trigger needed from frontend.
 */
const syncTaskProgressForUser = async (userId: number): Promise<void> => {
  if (!isWorkingDay(new Date())) return;

  const today = getDateOnly(new Date());

  const tasks = await prisma.task.findMany({
    where: { assignedToId: userId, isActive: true },
  });

  if (tasks.length === 0) return;

  const achieved = await countContactsForDay(userId, today);

  for (const task of tasks) {
    const log = await prisma.taskDailyLog.findUnique({
      where: { taskId_date: { taskId: task.id, date: today } },
    });

    // Only sync if log exists and not yet finalized
    if (!log || log.performance !== null) continue;

    const status =
      achieved >= task.targetValue ? TaskStatus.COMPLETED : TaskStatus.PENDING;

    await prisma.taskDailyLog.update({
      where: { id: log.id },
      data: { achieved, status },
    });
  }
};

export const TaskService = {
  getMyTasks,
  createTask,
  updateTask,
  syncTodayProgress,
  syncTaskProgressForUser,
  getAllTasks,
  getTaskById,
  deleteTask,
};
