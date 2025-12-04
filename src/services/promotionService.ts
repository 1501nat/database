/**
 * Promotion Service - Dịch vụ quản lý khuyến mãi
 * @description Kết nối với /api/promotions endpoints của backend
 */

import apiRequest from './api';

export interface Promotion {
  ma_ctkm: string;
  ten_chuong_trinh: string;
  mo_ta?: string | null;
  loai_khuyen_mai?: string | null;
  gia_tri_khuyen_mai?: number | null;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  trang_thai_ct?: string | null;
}

/**
 * Lấy danh sách tất cả khuyến mãi
 * @endpoint GET /api/promotions
 */
export const getAll = async (): Promise<Promotion[]> => {
  return apiRequest<Promotion[]>('/promotions');
};

/**
 * Lấy danh sách khuyến mãi đang hoạt động
 * @endpoint GET /api/promotions/active
 */
export const getActive = async (): Promise<Promotion[]> => {
  return apiRequest<Promotion[]>('/promotions/active');
};

/**
 * Lấy thông tin một khuyến mãi
 * @endpoint GET /api/promotions/:id
 */
export const getById = async (id: string): Promise<Promotion> => {
  return apiRequest<Promotion>(`/promotions/${id}`);
};

/**
 * Lấy sản phẩm trong khuyến mãi
 * @endpoint GET /api/promotions/:id/products
 */
export const getPromotionProducts = async (id: string): Promise<any[]> => {
  return apiRequest(`/promotions/${id}/products`);
};

/**
 * Tạo khuyến mãi mới
 * @endpoint POST /api/promotions
 */
export const create = async (data: Promotion): Promise<{ message: string; id: string }> => {
  return apiRequest('/promotions', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật khuyến mãi
 * @endpoint PUT /api/promotions/:id
 */
export const update = async (id: string, data: Partial<Promotion>): Promise<{ message: string }> => {
  return apiRequest(`/promotions/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa khuyến mãi
 * @endpoint DELETE /api/promotions/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/promotions/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Thêm sản phẩm vào khuyến mãi
 * @endpoint POST /api/promotions/:id/products
 */
export const addProduct = async (id: string, ma_sp: string): Promise<{ message: string }> => {
  return apiRequest(`/promotions/${id}/products`, {
    method: 'POST',
    body: { ma_sp },
  });
};

/**
 * Xóa sản phẩm khỏi khuyến mãi
 * @endpoint DELETE /api/promotions/:id/products/:ma_sp
 */
export const removeProduct = async (id: string, ma_sp: string): Promise<{ message: string }> => {
  return apiRequest(`/promotions/${id}/products/${ma_sp}`, {
    method: 'DELETE',
  });
};
