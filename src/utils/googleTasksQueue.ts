// src/utils/googleTaskQueue.ts

import { patchTask } from 'src/api/googleTasks';

export type TaskPatchPayload = {
  title?: string;
  notes?: string;
  status?: 'completed' | 'needsAction';
};

type QueueItem = {
  taskListId: string;
  taskId: string;
  payload: TaskPatchPayload;
};

const queue = new Map<string, QueueItem>();
let timer: ReturnType<typeof setTimeout> | null = null;

export function queueTaskPatch(
  taskListId: string,
  taskId: string,
  payload: TaskPatchPayload
) {
  const key = `${taskListId}:${taskId}`;

  // merge payload (PATCH behavior)
  const existing = queue.get(key);
  queue.set(key, {
    taskListId,
    taskId,
    payload: {
      ...(existing?.payload ?? {}),
      ...payload,
    },
  });

  scheduleFlush();
}

function scheduleFlush() {
  if (timer) return;

  timer = setTimeout(async () => {
    const jobs = Array.from(queue.values());
    queue.clear();
    timer = null;

    await Promise.allSettled(
      jobs.map((job) =>
        patchTask(job.taskListId, job.taskId, job.payload)
      )
    );
  }, 600); // debounce 600ms
}
