// AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { getCurrentUserInfoRequest, loginRequest } from "../identityApi";
const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const data  = await getCurrentUserInfoRequest()
      setUser(data);
    } catch {
      localStorage.removeItem("auth");
      setUser(null);
    }
  }, []);

  // Runs on every page load / refresh
  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem("auth")) {
        await fetchUser();
      }
      setLoading(false);
    };

    init();
  }, [fetchUser]);

  const login = async (email, password) => {
    const data= await loginRequest(email, password)
    localStorage.setItem("auth", JSON.stringify(data));
    await fetchUser(); // second request right after login
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
