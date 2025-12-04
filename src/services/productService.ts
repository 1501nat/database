/**
 * Product Service - Dịch vụ quản lý sản phẩm
 * @description Kết nối với /api/products endpoints của backend
 */

import apiRequest from './api';

export interface Product {
  ma_sp: string;
  ten_sp: string;
  mo_ta?: string;
  don_vi_tinh?: string;
  gia_ban_le?: number;
  ma_vach?: string;
  trang_thai_sp?: string;
  ma_dm: string;
  ngay_them_vao?: string;
}

/**
 * Lấy danh sách tất cả sản phẩm
 * @endpoint GET /api/products
 */
export const getAll = async (): Promise<Product[]> => {
  return apiRequest<Product[]>('/products');
};

/**
 * Lấy thông tin một sản phẩm
 * @endpoint GET /api/products/:id
 */
export const getById = async (id: string): Promise<Product> => {
  return apiRequest<Product>(`/products/${id}`);
};

/**
 * Tạo sản phẩm mới
 * @endpoint POST /api/products
 */
export const create = async (data: Product): Promise<{ message: string; id: string }> => {
  return apiRequest('/products', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật sản phẩm
 * @endpoint PUT /api/products/:id
 */
export const update = async (id: string, data: Partial<Product>): Promise<{ message: string }> => {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa sản phẩm
 * @endpoint DELETE /api/products/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
};
