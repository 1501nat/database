/**
 * API Configuration - Cấu hình kết nối với backend Node.js
 * @description Base API client để gọi các endpoint từ backend Express
 */

// API Base URL - Thay đổi URL này khi deploy backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token storage key
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Get stored user
export const getStoredUser = (): any | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Set stored user
export const setStoredUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// API Request Interface
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * API Request Function - Hàm gọi API chính
 * @description Tự động thêm Authorization header nếu có token
 */
export const apiRequest = async <T>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { method = 'GET', body, headers = {} } = options;
  
  const token = getToken();
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (fetchError) {
    console.error('Network error:', fetchError);
    throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error('Server trả về dữ liệu không hợp lệ');
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Nếu đang ở trang login (endpoint chứa /login), không redirect
    const isLoginEndpoint = endpoint.includes('/login');
    
    if (!isLoginEndpoint) {
      // Token expired - chỉ redirect nếu không phải đang login
      removeToken();
      window.location.href = '/auth';
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
    
    // Login failed - throw actual error from server
    throw new Error(data.error || 'Email hoặc mật khẩu không đúng');
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Có lỗi xảy ra');
  }

  return data;
};

export default apiRequest;