/**
 * Customer Service - Dịch vụ quản lý khách hàng
 * @description Kết nối với /api/customers endpoints của backend
 */

import apiRequest from './api';

export interface Customer {
  ma_kh: string;
  ho_ten: string;
  sdt: string;
  email?: string;
  gioi_tinh?: string;
  ngay_sinh?: string;
  dia_chi?: string;
  ngay_dang_ky?: string;
  hang_thanh_vien?: string;
  diem_tich_luy?: number;
}

/**
 * Lấy danh sách tất cả khách hàng
 * @endpoint GET /api/customers
 */
export const getAll = async (): Promise<Customer[]> => {
  return apiRequest<Customer[]>('/customers');
};

/**
 * Lấy thông tin một khách hàng
 * @endpoint GET /api/customers/:id
 */
export const getById = async (id: string): Promise<Customer> => {
  return apiRequest<Customer>(`/customers/${id}`);
};

/**
 * Tạo khách hàng mới
 * @endpoint POST /api/customers
 */
export const create = async (data: Customer): Promise<{ message: string; id: string }> => {
  return apiRequest('/customers', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật khách hàng
 * @endpoint PUT /api/customers/:id
 */
export const update = async (id: string, data: Partial<Customer>): Promise<{ message: string }> => {
  return apiRequest(`/customers/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa khách hàng
 * @endpoint DELETE /api/customers/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/customers/${id}`, {
    method: 'DELETE',
  });
};
