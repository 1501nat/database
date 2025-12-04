/**
 * Employee Service - Dịch vụ quản lý nhân viên
 * @description Kết nối với /api/employees endpoints của backend
 */

import apiRequest from './api';

export interface Employee {
  ma_nv: string;
  ho_ten: string;
  sdt?: string;
  email?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  cccd?: string;
  dia_chi_thuong_tru?: string;
  ngay_vao_lam?: string;
  trang_thai_lam_viec?: string;
  ma_cn: string;
  ma_giam_sat?: string;
}

/**
 * Lấy danh sách tất cả nhân viên
 * @endpoint GET /api/employees
 */
export const getAll = async (): Promise<Employee[]> => {
  return apiRequest<Employee[]>('/employees');
};

/**
 * Lấy thông tin một nhân viên
 * @endpoint GET /api/employees/:id
 */
export const getById = async (id: string): Promise<Employee> => {
  return apiRequest<Employee>(`/employees/${id}`);
};

/**
 * Tạo nhân viên mới
 * @endpoint POST /api/employees
 */
export const create = async (data: Employee): Promise<{ message: string; id: string }> => {
  return apiRequest('/employees', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật nhân viên
 * @endpoint PUT /api/employees/:id
 */
export const update = async (id: string, data: Partial<Employee>): Promise<{ message: string }> => {
  return apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa nhân viên
 * @endpoint DELETE /api/employees/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  });
};
