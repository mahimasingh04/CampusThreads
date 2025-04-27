
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
       
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.user) {
        console.error("User data missing in response:", data);
        throw new Error("Server response incomplete - missing user data");
      }
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      };
      

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      
      toast.success("Login successful!");
      navigate("/feed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success("Account created successfully! Please log in.");
      navigate("/signin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};