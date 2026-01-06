import axios from 'axios';
import { authEvents } from 'src/guards/google/authEvents';

const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      authEvents.logout();
    }
    return Promise.reject(error);
  }
);

export default instance;
