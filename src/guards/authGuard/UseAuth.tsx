import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authEvents } from 'src/guards/google/authEvents';

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleTokenClient {
  requestAccessToken: () => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

const CLIENT_ID = '392300282718-pdm00rrj454sd6en340spphfpgk9oepk.apps.googleusercontent.com';
const TOKEN_KEY = 'google_token';

const useAuth = () => {
  const navigate = useNavigate();
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔁 REGISTER GLOBAL LOGOUT (sekali saja)
  useEffect(() => {
    authEvents.logout = () => {
      sessionStorage.removeItem(TOKEN_KEY);
      setIsAuthenticated(false);
      navigate('/auth/login', { replace: true });
    };
  }, [navigate]);

  // 🔐 INIT GOOGLE TOKEN CLIENT
  useEffect(() => {
    if (!window.google) return;

    tokenClientRef.current =
      window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/tasks',
        callback: (response) => {
          sessionStorage.setItem(TOKEN_KEY, response.access_token);
          setIsAuthenticated(true);
          navigate('/apps/kanban', { replace: true });
        },
      });

    // cek token saat refresh
    const token = sessionStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(!!token);
    setIsInitialized(true);
  }, [navigate]);

  const loginWithGoogle = useCallback(() => {
    tokenClientRef.current?.requestAccessToken();
  }, []);

  return {
    loginWithGoogle,
    logout: authEvents.logout,
    isAuthenticated,
    isInitialized,
    getToken: () => sessionStorage.getItem(TOKEN_KEY),
  };
};

export default useAuth;
