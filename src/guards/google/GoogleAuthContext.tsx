import { createContext, useEffect, useReducer, ReactNode } from 'react';
import axios from 'axios';
import ENV from 'src/config/env';

// Backend base URL for all routes (both web routes like /auth/google and API routes like /api/auth/me)
const BACKEND_URL = ENV.API_BASE_URL;

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
  handleAuthCallback: () => Promise<boolean>; // No token parameter - uses cookies
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
  // Uses Laravel Sanctum cookie-based authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Call /api/auth/me to check if user has valid session cookie
        // Laravel Sanctum automatically validates the session cookie
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          withCredentials: true, // Send cookies with request
        });

        // Backend should return { success: true, data: { user: {...} } }
        if (response.data.success && response.data.data?.user) {
          dispatch({
            type: 'INIT',
            payload: {
              isAuthenticated: true,
              user: response.data.data.user,
            },
          });
          return;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // If /api/auth/me fails, user is not authenticated
      }

      // Not authenticated
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
  // Redirects to backend OAuth endpoint
  // Backend handles OAuth flow and redirects back to /auth/success
  const loginWithGoogle = async () => {
    try {
      window.location.href = `${BACKEND_URL}/api/auth/google`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Check authentication after backend callback
  // This is called by the /auth/success page
  const handleAuthCallback = async (): Promise<boolean> => {
    try {
      // Call /api/auth/me to get user data
      // Session cookie is automatically sent by browser
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data?.user) {
        const user = response.data.data.user;

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
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Call backend logout endpoint to clear session
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });

      dispatch({
        type: 'LOGOUT',
        payload: {},
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      dispatch({
        type: 'LOGOUT',
        payload: {},
      });
      throw error;
    }
  };

  // Check current authentication status
  // Calls /api/auth/me to verify session is still valid
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data?.user) {
        dispatch({
          type: 'LOGIN',
          payload: {
            user: response.data.data.user,
          },
        });
      } else {
        dispatch({
          type: 'LOGOUT',
          payload: {},
        });
      }
    } catch (error) {
      console.error('Check auth error:', error);
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
