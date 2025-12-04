/**
 * Sales Service - Dịch vụ quản lý bán hàng/hóa đơn
 * @description Kết nối với /api/sales endpoints của backend
 */

import apiRequest from './api';

export interface SaleItem {
  ma_sp: string;
  so_luong_ban: number;
  don_gia_ban: number;
}

export interface Sale {
  ma_hdbh: string;
  ma_cn: string;
  ma_nv_bh: string;
  ma_kh?: string | null;
  tong_gia_tri_truoc_giam: number;
  so_tien_giam_gia?: number;
  tong_tien_thanh_toan: number;
  so_tien_khach_dua: number;
  so_tien_thoi_lai?: number;
  hinh_thuc_thanh_toan?: string;
  ngay_gio_giao_dich: string;
  trang_thai_hoa_don?: string;
  ghi_chu?: string;
  items?: SaleItem[];
}

/**
 * Lấy danh sách tất cả hóa đơn
 * @endpoint GET /api/sales
 */
export const getAll = async (): Promise<Sale[]> => {
  return apiRequest<Sale[]>('/sales');
};

/**
 * Lấy thông tin một hóa đơn
 * @endpoint GET /api/sales/:id
 */
export const getById = async (id: string): Promise<Sale> => {
  return apiRequest<Sale>(`/sales/${id}`);
};

/**
 * Lấy chi tiết hóa đơn
 * @endpoint GET /api/sales/:id/details
 */
export const getInvoiceDetails = async (id: string): Promise<any[]> => {
  return apiRequest(`/sales/${id}/details`);
};

/**
 * Lấy hóa đơn theo chi nhánh
 * @endpoint GET /api/sales/branch/:ma_cn
 */
export const getByBranch = async (ma_cn: string): Promise<Sale[]> => {
  return apiRequest<Sale[]>(`/sales/branch/${ma_cn}`);
};

/**
 * Lấy hóa đơn theo khoảng thời gian
 * @endpoint GET /api/sales/report/date-range
 */
export const getByDateRange = async (startDate: string, endDate: string): Promise<Sale[]> => {
  return apiRequest<Sale[]>(`/sales/report/date-range?startDate=${startDate}&endDate=${endDate}`);
};

/**
 * Tạo hóa đơn mới
 * @endpoint POST /api/sales
 */
export const create = async (data: Sale): Promise<{ message: string; id: string }> => {
  return apiRequest('/sales', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật hóa đơn
 * @endpoint PUT /api/sales/:id
 */
export const update = async (id: string, data: Partial<Sale>): Promise<{ message: string }> => {
  return apiRequest(`/sales/${id}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa hóa đơn
 * @endpoint DELETE /api/sales/:id
 */
export const remove = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/sales/${id}`, {
    method: 'DELETE',
  });
};
