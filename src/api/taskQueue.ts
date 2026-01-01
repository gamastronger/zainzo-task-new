// src/api/taskQueue.ts

type Job = () => Promise<void>;

let queue: Job[] = [];

export function enqueue(job: Job) {
  queue.push(job);
}

setInterval(async () => {
  if (!queue.length) return;

  const jobs = [...queue];
  queue = [];

  await Promise.allSettled(jobs.map((j) => j()));
}, 1000);
