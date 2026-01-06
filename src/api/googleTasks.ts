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
    let errorMessage = `API_ERROR ${res.status}`;
    try {
      const errorData = await res.json();
      console.error('❌ API Error Response:', errorData);
      if (errorData.error?.message) {
        errorMessage += `: ${errorData.error.message}`;
      }
    } catch (e) {
      // Jika gagal parse error response
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (like DELETE returning 204 No Content)
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null as any;
  }

  const text = await res.text();
  if (!text || text.trim() === '') {
    return null as any;
  }

  return JSON.parse(text);
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
  // Tambahkan showCompleted=true dan showHidden=true agar completed tasks juga di-load
  return request<{ items?: GoogleTask[] }>(
    `${BASE_URL}/lists/${taskListId}/tasks?showCompleted=true&showHidden=true`
  ).then((r) => r.items ?? []);
}

export function createTask(
  taskListId: string,
  task: Pick<GoogleTask, 'title' | 'notes' | 'due'>
) {
  console.log('📤 Creating task with payload:', { taskListId, task });
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

export function moveTask(
  taskListId: string,
  taskId: string,
  options?: { parent?: string; previous?: string }
) {
  // Move task to different list or reorder within same list
  // previous: ID of the sibling task after which to position this task
  // parent: Parent task identifier (for subtasks)
  let url = `${BASE_URL}/lists/${taskListId}/tasks/${taskId}/move`;
  const params = new URLSearchParams();
  
  if (options?.previous) {
    params.append('previous', options.previous);
  }
  if (options?.parent) {
    params.append('parent', options.parent);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  console.log('🔄 Moving task:', { taskListId, taskId, options, url });
  return request<GoogleTask>(url, { method: 'POST' });
}
