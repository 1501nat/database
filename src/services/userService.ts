/**
 * User Service - Dịch vụ quản lý tài khoản người dùng
 * @description Kết nối với /api/auth endpoints của backend
 */

import apiRequest from './api';

export interface User {
  id: number;
  email: string;
  role: string;
  ma_nv: string | null;
  ho_ten?: string;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: string;
  ma_nv?: string;
}

export interface UpdateUserData {
  role?: string;
  ma_nv?: string;
  password?: string;
}

/**
 * Lấy danh sách tài khoản
 * @endpoint GET /api/auth/users
 */
export const getUsers = async (): Promise<User[]> => {
  return apiRequest<User[]>('/auth/users');
};

/**
 * Tạo tài khoản mới
 * @endpoint POST /api/auth/users
 */
export const createUser = async (data: CreateUserData): Promise<{ message: string; user: User }> => {
  return apiRequest('/auth/users', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật tài khoản
 * @endpoint PUT /api/auth/users/:id
 */
export const updateUser = async (id: number, data: UpdateUserData): Promise<{ message: string }> => {
  return apiRequest(`/auth/users/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa tài khoản
 * @endpoint DELETE /api/auth/users/:id
 */
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  return apiRequest(`/auth/users/${id}`, {
    method: 'DELETE',
  });
};
