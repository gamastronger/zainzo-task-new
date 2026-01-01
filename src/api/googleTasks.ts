// src/api/googleTask.ts
import { authEvents } from 'src/guards/google/authEvents';

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status?: 'needsAction' | 'completed';
  due?: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
}

const BASE_URL = 'https://tasks.googleapis.com/tasks/v1';
const TOKEN_KEY = 'google_token';

function getToken(): string {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error('Google token tidak ditemukan');
  return token;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  // 🚨 TOKEN INVALID / EXPIRED
  if (res.status === 401) {
    authEvents.logout();
    throw new Error('Unauthorized - token expired');
  }

  if (!res.ok) {
    throw new Error(`API_ERROR ${res.status}`);
  }

  return res.json();
}

/* ===== TASK LIST ===== */

export function fetchTaskLists() {
  return request<{ items?: GoogleTaskList[] }>(
    `${BASE_URL}/users/@me/lists`
  ).then((r) => r.items ?? []);
}

export function createTaskList(title: string) {
  return request<GoogleTaskList>(
    `${BASE_URL}/users/@me/lists`,
    { method: 'POST', body: JSON.stringify({ title }) }
  );
}

export function deleteTaskList(taskListId: string) {
  return request<void>(
    `${BASE_URL}/users/@me/lists/${taskListId}`,
    { method: 'DELETE' }
  );
}

/* ===== TASK ===== */

export function fetchTasks(taskListId: string) {
  return request<{ items?: GoogleTask[] }>(
    `${BASE_URL}/lists/${taskListId}/tasks`
  ).then((r) => r.items ?? []);
}

export function createTask(
  taskListId: string,
  task: Pick<GoogleTask, 'title' | 'notes' | 'due'>
) {
  return request<GoogleTask>(
    `${BASE_URL}/lists/${taskListId}/tasks`,
    { method: 'POST', body: JSON.stringify(task) }
  );
}

export function patchTask(
  taskListId: string,
  taskId: string,
  updates: Partial<GoogleTask>
) {
  return request<GoogleTask>(
    `${BASE_URL}/lists/${taskListId}/tasks/${taskId}`,
    { method: 'PATCH', body: JSON.stringify(updates) }
  );
}

export function deleteTask(taskListId: string, taskId: string) {
  return request<void>(
    `${BASE_URL}/lists/${taskListId}/tasks/${taskId}`,
    { method: 'DELETE' }
  );
}
