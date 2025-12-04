/**
 * Auth Context - Quản lý trạng thái đăng nhập
 * @description Sử dụng JWT authentication từ backend Node.js
 * @api-connection Kết nối với /api/auth endpoints
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as authService from "@/services/authService";
import { getToken, getStoredUser, removeToken } from "@/services/api";

interface User {
  id: number;
  email: string;
  role: string;
  ma_nv: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, maNV?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra token khi khởi động - API: Kiểm tra localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          // Có token, lấy user từ localStorage hoặc gọi API
          const storedUser = getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Nếu không có user trong localStorage, gọi API để lấy
            // API: GET /api/auth/me
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          }
        }
      } catch (error) {
        // Token không hợp lệ, xóa đi
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Đăng nhập
   * @api POST /api/auth/login
   */
  const signIn = async (email: string, password: string) => {
    try {
      // API: POST /api/auth/login
      const response = await authService.login(email, password);
      setUser(response.user);
      toast.success("Đăng nhập thành công!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập thất bại");
      throw error;
    }
  };

  /**
   * Đăng ký
   * @api POST /api/auth/register
   */
  const signUp = async (email: string, password: string, maNV?: string) => {
    try {
      // API: POST /api/auth/register
      await authService.register(email, password, maNV);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Đăng ký thất bại");
      throw error;
    }
  };

  /**
   * Đăng xuất
   * @api POST /api/auth/logout
   */
  const signOut = async () => {
    try {
      // API: POST /api/auth/logout
      await authService.logout();
      setUser(null);
      toast.success("Đăng xuất thành công!");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Đăng xuất thất bại");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
