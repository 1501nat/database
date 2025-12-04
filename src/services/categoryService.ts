/**
 * Category Service - Dịch vụ quản lý danh mục sản phẩm
 * @description Kết nối với /api/categories endpoints của backend
 */

import apiRequest from './api';

export interface Category {
  ma_dm: string;
  ten_danh_muc: string;
  mo_ta?: string | null;
  ma_dm_super?: string | null;
}

/**
 * Lấy danh sách tất cả danh mục
 * @endpoint GET /api/categories
 */
export const getAll = async (): Promise<Category[]> => {
  return apiRequest<Category[]>('/categories');
};

/**
 * Lấy thông tin một danh mục
 * @endpoint GET /api/categories/:id
 */
export const getById = async (id: string): Promise<Category> => {
  return apiRequest<Category>(`/categories/${id}`);
};

/**
 * Tạo danh mục mới
 * @endpoint POST /api/categories
 */
export const create = async (data: Category): Promise<{ message: string; id: string }> => {
  return apiRequest('/categories', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật danh mục
 * @endpoint PUT /api/categories/:id
 */
export const update = async (id: string, data: Partial<Category>): Promise<{ message: string }> => {
  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa danh mục
 * @endpoint DELETE /api/categories/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
};
