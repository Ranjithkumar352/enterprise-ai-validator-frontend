"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import Cookies from "js-cookie";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "@/services/auth.service";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (data: LoginData) => Promise<any>;

  register: (data: RegisterData) => Promise<any>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await getCurrentUser();

      setUser(res.user);
    } catch (error) {
      Cookies.remove("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    const res = await registerUser(data);

    Cookies.set("token", res.token, {
      expires: 7,
      sameSite: "strict",
    });

    setUser(res.user);

    return res;
  };

  const login = async (data: LoginData) => {
    const res = await loginUser(data);

    Cookies.set("token", res.token, {
      expires: 7,
      sameSite: "strict",
    });

    setUser(res.user);

    return res;
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);