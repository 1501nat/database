/**
 * Branch Service - Dịch vụ quản lý chi nhánh
 * @description Kết nối với /api/branches endpoints của backend
 */

import apiRequest from './api';

export interface Branch {
  ma_cn: string;
  ten_cn: string;
  dia_chi?: string;
  sdt?: string;
  ngay_mo_cua?: string;
  trang_thai_hoat_dong?: string;
  so_nha_duong?: string;
  phuong_xa?: string;
  quan_huyen?: string;
  tinh_thanh?: string;
}

/**
 * Lấy danh sách tất cả chi nhánh
 * @endpoint GET /api/branches
 */
export const getAll = async (): Promise<Branch[]> => {
  return apiRequest<Branch[]>('/branches');
};

/**
 * Lấy thông tin một chi nhánh
 * @endpoint GET /api/branches/:id
 */
export const getById = async (id: string): Promise<Branch> => {
  return apiRequest<Branch>(`/branches/${id}`);
};

/**
 * Tạo chi nhánh mới
 * @endpoint POST /api/branches
 */
export const create = async (data: Branch): Promise<{ message: string; id: string }> => {
  return apiRequest('/branches', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật chi nhánh
 * @endpoint PUT /api/branches/:id
 */
export const update = async (id: string, data: Partial<Branch>): Promise<{ message: string }> => {
  return apiRequest(`/branches/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa chi nhánh
 * @endpoint DELETE /api/branches/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/branches/${id}`, {
    method: 'DELETE',
  });
};
