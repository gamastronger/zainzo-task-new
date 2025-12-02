import { createContext, useEffect, useReducer, ReactNode } from 'react';
import axios from 'axios';
import ENV from 'src/config/env';

// Use API_BASE_URL for API routes (/api/*)
const API_BASE_URL = ENV.API_BASE_URL;
// Use base URL (without /api) for web routes like OAuth
const BASE_URL = ENV.API_URL.replace('/api', '');

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface InitialStateType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

interface AuthAction {
  type: 'INIT' | 'LOGIN' | 'LOGOUT';
  payload: {
    isAuthenticated?: boolean;
    user?: User | null;
  };
}

const reducer = (state: InitialStateType, action: AuthAction): InitialStateType => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated ?? false,
        user: action.payload.user ?? null,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user ?? null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends InitialStateType {
  platform: string;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  handleAuthCallback: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  platform: 'GoogleOAuth',
  loginWithGoogle: () => {},
  logout: async () => {},
  checkAuth: async () => {},
  handleAuthCallback: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
          const response = await axios.get(`${API_BASE_URL}/auth/user`, {
            params: { userId },
            withCredentials: true,
          });

          if (response.data.success) {
            dispatch({
              type: 'INIT',
              payload: {
                isAuthenticated: true,
                user: response.data.user,
              },
            });
            return;
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('userId');
      }

      dispatch({
        type: 'INIT',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    };

    initAuth();
  }, []);

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      // Redirect directly to backend Google OAuth endpoint
      // Backend will handle OAuth and redirect back to frontend with token
      // Note: /auth/google is a web route, not API route
      window.location.href = `${BASE_URL}/auth/google`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Handle callback token from backend
  const handleAuthCallback = async (token: string) => {
    try {
      // Save token to localStorage
      localStorage.setItem('authToken', token);

      // Get user data using the token
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem('userId', user.id);

        dispatch({
          type: 'LOGIN',
          payload: {
            user: user,
          },
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Callback handling error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      await axios.post(`${API_BASE_URL}/auth/logout`, { userId }, {
        withCredentials: true,
      });

      localStorage.removeItem('userId');
      
      dispatch({
        type: 'LOGOUT',
        payload: {},
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Check auth after callback
  const checkAuth = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        dispatch({
          type: 'LOGOUT',
          payload: {},
        });
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        params: { userId },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch({
          type: 'LOGIN',
          payload: {
            user: response.data.user,
          },
        });
      } else {
        localStorage.removeItem('userId');
        dispatch({
          type: 'LOGOUT',
          payload: {},
        });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      localStorage.removeItem('userId');
      dispatch({
        type: 'LOGOUT',
        payload: {},
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'GoogleOAuth',
        loginWithGoogle,
        logout,
        checkAuth,
        handleAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
