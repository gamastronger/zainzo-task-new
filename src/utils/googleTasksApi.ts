import axios from 'axios';
import ENV from 'src/config/env';
  
const API_BASE_URL = `${ENV.API_BASE_URL}/api`;

// Create axios instance with credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add userId to requests automatically
apiClient.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    if (config.method === 'get' || config.method === 'delete') {
      config.params = { ...config.params, userId };
    } else {
      config.data = { ...config.data, userId };
    }
  }
  return config;
});

export const googleTasksApi = {
  // Get all tasks
  getTasks: async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  // Create new task
  createTask: async (taskData: {
    title: string;
    notes?: string;
    due?: string;
    taskListId?: string;
  }) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (
    taskId: string,
    taskData: {
      taskListId: string;
      title?: string;
      notes?: string;
      status?: string;
      due?: string;
    }
  ) => {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId: string, taskListId: string) => {
    const response = await apiClient.delete(`/tasks/${taskId}`, {
      params: { taskListId },
    });
    return response.data;
  },
};

export const authApi = {
  // Get current user
  getUser: async () => {
    const response = await apiClient.get('/auth/user');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export default apiClient;
