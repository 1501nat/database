/**
 * Purchase Service - Dịch vụ quản lý nhập hàng
 * @description Kết nối với /api/purchases endpoints của backend
 */

import apiRequest from './api';

export interface PurchaseItem {
  ma_sp: string;
  so_luong_nhap: number;
  don_gia_nhap: number;
}

export interface Purchase {
  ma_phieu_nhap: string;
  ma_cn: string;
  ma_ncc: string;
  ma_nv_kho: string;
  ngay_gio_nhap: string;
  tong_gia_tri: number;
  so_tien_da_thanh_toan?: number;
  trang_thai_thanh_toan?: string;
  ghi_chu?: string;
  items?: PurchaseItem[];
}

/**
 * Lấy danh sách tất cả phiếu nhập
 * @endpoint GET /api/purchases
 */
export const getAll = async (): Promise<Purchase[]> => {
  return apiRequest<Purchase[]>('/purchases');
};

/**
 * Lấy thông tin một phiếu nhập
 * @endpoint GET /api/purchases/:id
 */
export const getById = async (id: string): Promise<Purchase> => {
  return apiRequest<Purchase>(`/purchases/${id}`);
};

/**
 * Lấy chi tiết phiếu nhập
 * @endpoint GET /api/purchases/:id/details
 */
export const getPurchaseDetails = async (id: string): Promise<any[]> => {
  return apiRequest(`/purchases/${id}/details`);
};

/**
 * Tạo phiếu nhập mới
 * @endpoint POST /api/purchases
 */
export const create = async (data: Purchase): Promise<{ message: string; id: string }> => {
  return apiRequest('/purchases', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật phiếu nhập
 * @endpoint PUT /api/purchases/:id
 */
export const update = async (id: string, data: Partial<Purchase>): Promise<{ message: string }> => {
  return apiRequest(`/purchases/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa phiếu nhập
 * @endpoint DELETE /api/purchases/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/purchases/${id}`, {
    method: 'DELETE',
  });
};