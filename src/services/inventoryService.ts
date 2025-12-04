/**
 * Inventory Service - Dịch vụ quản lý tồn kho
 * @description Kết nối với /api/inventory endpoints của backend
 */

import apiRequest from './api';

export interface InventoryItem {
  ma_sp: string;
  ma_cn: string;
  so_luong_ton?: number;
  so_luong_toi_da?: number;
  so_luong_toi_thieu?: number;
  ngay_cap_nhat?: string;
  san_pham?: { ten_sp: string; don_vi_tinh: string };
  chi_nhanh?: { ten_cn: string };
}

/**
 * Lấy danh sách tất cả tồn kho
 * @endpoint GET /api/inventory
 */
export const getAll = async (): Promise<InventoryItem[]> => {
  return apiRequest<InventoryItem[]>('/inventory');
};

/**
 * Lấy thông tin tồn kho theo sản phẩm và chi nhánh
 * @endpoint GET /api/inventory/:ma_cn/:ma_sp
 */
export const getById = async (ma_cn: string, ma_sp: string): Promise<InventoryItem> => {
  return apiRequest<InventoryItem>(`/inventory/${ma_cn}/${ma_sp}`);
};

/**
 * Lấy tồn kho theo chi nhánh
 * @endpoint GET /api/inventory/branch/:ma_cn
 */
export const getByBranch = async (ma_cn: string): Promise<InventoryItem[]> => {
  return apiRequest<InventoryItem[]>(`/inventory/branch/${ma_cn}`);
};

/**
 * Lấy danh sách hàng sắp hết
 * @endpoint GET /api/inventory/alerts/low-stock
 */
export const getLowStock = async (): Promise<InventoryItem[]> => {
  return apiRequest<InventoryItem[]>('/inventory/alerts/low-stock');
};

/**
 * Tạo tồn kho mới
 * @endpoint POST /api/inventory
 */
export const create = async (data: InventoryItem): Promise<{ message: string }> => {
  return apiRequest('/inventory', {
    method: 'POST',
    body: data,
  });
};

/**
 * Cập nhật tồn kho
 * @endpoint PUT /api/inventory/:ma_cn/:ma_sp
 */
export const update = async (
  ma_cn: string, 
  ma_sp: string, 
  data: Partial<InventoryItem>
): Promise<{ message: string }> => {
  return apiRequest(`/inventory/${ma_cn}/${ma_sp}`, {
    method: 'PUT',
    body: data,
  });
};

/**
 * Xóa tồn kho
 * @endpoint DELETE /api/inventory/:ma_cn/:ma_sp
 */
export const remove = async (ma_cn: string, ma_sp: string): Promise<{ message: string }> => {
  return apiRequest(`/inventory/${ma_cn}/${ma_sp}`, {
    method: 'DELETE',
  });
};
