/**
 * Report Service - Dịch vụ báo cáo
 * @description Kết nối với /api/reports endpoints của backend
 */

import apiRequest from './api';

export interface DashboardStats {
  branches: number;
  employees: number;
  products: number;
  customers: number;
  lowStockItems: number;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  topProducts: Array<{
    ma_sp: string;
    ten_sp: string;
    so_luong_ban: number;
  }>;
  recentOrders: any[];
}

/**
 * Lấy thống kê dashboard
 * @endpoint GET /api/reports/dashboard
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return apiRequest<DashboardStats>('/reports/dashboard');
};

/**
 * Lấy báo cáo doanh thu
 * @endpoint GET /api/reports/sales
 */
export const getSalesReport = async (
  startDate?: string, 
  endDate?: string
): Promise<SalesReport> => {
  let url = '/reports/sales';
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  return apiRequest<SalesReport>(url);
};

/**
 * Lấy báo cáo doanh thu theo chi nhánh
 * @endpoint GET /api/reports/sales/branch/:ma_cn
 */
export const getSalesByBranch = async (
  ma_cn: string, 
  startDate?: string, 
  endDate?: string
): Promise<any> => {
  let url = `/reports/sales/branch/${ma_cn}`;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  return apiRequest(url);
};

/**
 * Lấy báo cáo tồn kho
 * @endpoint GET /api/reports/inventory
 */
export const getInventoryReport = async (): Promise<any> => {
  return apiRequest('/reports/inventory');
};

/**
 * Lấy top sản phẩm bán chạy
 * @endpoint GET /api/reports/top-products
 */
export const getTopProducts = async (limit: number = 10): Promise<any[]> => {
  return apiRequest(`/reports/top-products?limit=${limit}`);
};
