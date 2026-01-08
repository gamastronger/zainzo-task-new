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
const USER_KEY = 'google_user';

const useAuth = () => {
  const navigate = useNavigate();
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; picture?: string } | null>(null);

  // 🔁 REGISTER GLOBAL LOGOUT (sekali saja)
  useEffect(() => {
    authEvents.logout = () => {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
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
        scope: 'openid email profile https://www.googleapis.com/auth/tasks',
        callback: async (response) => {
          sessionStorage.setItem(TOKEN_KEY, response.access_token);
          setIsAuthenticated(true);
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` },
            });
            if (res.ok) {
              const info = (await res.json()) as { name?: string; email?: string; picture?: string };
              const userData = { name: info.name, email: info.email, picture: info.picture };
              setUser(userData);
              sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
            }
          } catch (e) {
            console.warn('Failed to fetch Google userinfo', e);
          }
          navigate('/app', { replace: true });
        },
      });

    // cek token saat refresh
    const token = sessionStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(!!token);
    const cached = sessionStorage.getItem(USER_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        // ignore
      }
    }
    setIsInitialized(true);
  }, [navigate]);

  const loginWithGoogle = useCallback(() => {
    tokenClientRef.current?.requestAccessToken();
  }, []);

  const handleAuthCallback = useCallback(async () => {
    try {
      // Verify authentication (in a real app, this would call your backend)
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        // Use cached user if available, else fetch from Google
        const cached = sessionStorage.getItem(USER_KEY);
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // ignore
          }
        } else {
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const info = (await res.json()) as { name?: string; email?: string; picture?: string };
              const userData = { name: info.name, email: info.email, picture: info.picture };
              setUser(userData);
              sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
            }
          } catch (e) {
            console.warn('Failed to fetch Google userinfo', e);
          }
        }
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth callback error:', error);
      return false;
    }
  }, []);

  return {
    loginWithGoogle,
    logout: authEvents.logout,
    isAuthenticated,
    isInitialized,
    getToken: () => sessionStorage.getItem(TOKEN_KEY),
    user,
    handleAuthCallback,
  };
};

export default useAuth;
