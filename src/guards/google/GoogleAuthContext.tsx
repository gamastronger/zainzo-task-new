import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  useCallback,
} from 'react';
import axios from 'axios';
import ENV from 'src/config/env';

const BACKEND_URL = ENV.API_BASE_URL;

/* ================= TYPES ================= */

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

interface AuthAction {
  type: 'INIT' | 'LOGIN' | 'LOGOUT';
  payload?: {
    user?: User | null;
  };
}

interface AuthContextType extends InitialStateType {
  platform: 'GoogleOAuth';
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  handleAuthCallback: () => Promise<boolean>;
}

/* ================= STATE ================= */

const initialState: InitialStateType = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

/* ================= REDUCER ================= */

const reducer = (
  state: InitialStateType,
  action: AuthAction
): InitialStateType => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: !!action.payload?.user,
        user: action.payload?.user ?? null,
      };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user ?? null,
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

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  platform: 'GoogleOAuth',
  loginWithGoogle: () => {},
  logout: async () => {},
  checkAuth: async () => {},
  handleAuthCallback: async () => false,
});

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* ================= LOGOUT HANDLER ================= */

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // ignore backend error
    } finally {
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/login';
    }
  }, []);


  /* ================= INIT AUTH ================= */

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          withCredentials: true,
        });

        if (res.data?.success && res.data.data?.user) {
          dispatch({
            type: 'INIT',
            payload: { user: res.data.data.user },
          });
          return;
        }
      } catch {
        // silent
      }

      dispatch({ type: 'INIT' });
    };

    init();
  }, []);

  /* ================= ACTIONS ================= */

  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const handleAuthCallback = async (): Promise<boolean> => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });

      if (res.data?.success && res.data.data?.user) {
        dispatch({
          type: 'LOGIN',
          payload: { user: res.data.data.user },
        });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });

      if (res.data?.success && res.data.data?.user) {
        dispatch({
          type: 'LOGIN',
          payload: { user: res.data.data.user },
        });
      } else {
        await logout();
      }
    } catch {
      await logout();
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
