/**
 * Auth Service - Dịch vụ xác thực người dùng
 * @description Kết nối với /api/auth endpoints của backend
 */

import apiRequest, { setToken, removeToken, setStoredUser, getStoredUser, getToken } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    ma_nv: string | null;
  };
}

interface RegisterResponse {
  message: string;
  userId: number;
}

/**
 * Đăng nhập
 * @endpoint POST /api/auth/login
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  
  // Lưu token và user vào localStorage
  setToken(response.token);
  setStoredUser(response.user);
  
  return response;
};

/**
 * Đăng ký
 * @endpoint POST /api/auth/register
 */
export const register = async (
  email: string, 
  password: string, 
  ma_nv?: string
): Promise<RegisterResponse> => {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: { email, password, ma_nv },
  });
};

/**
 * Đăng xuất
 * @endpoint POST /api/auth/logout
 */
export const logout = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    removeToken();
  }
};

/**
 * Lấy thông tin user hiện tại
 * @endpoint GET /api/auth/me
 */
export const getCurrentUser = async (): Promise<any> => {
  return apiRequest('/auth/me');
};

/**
 * Đổi mật khẩu
 * @endpoint POST /api/auth/change-password
 */
export const changePassword = async (
  currentPassword: string, 
  newPassword: string
): Promise<{ message: string }> => {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });
};

/**
 * Kiểm tra có token hợp lệ không
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Lấy user từ localStorage
 */
export const getUser = () => {
  return getStoredUser();
};
