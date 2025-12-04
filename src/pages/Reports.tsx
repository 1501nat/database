/**
 * Reports Page - Trang báo cáo thống kê
 * @api-connections:
 *   - GET /api/reports/sales - Lấy báo cáo doanh thu
 *   - GET /api/sales - Lấy danh sách hóa đơn
 *   - GET /api/products - Lấy danh sách sản phẩm
 *   - GET /api/customers - Lấy danh sách khách hàng
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// API: Import services
import * as salesService from "@/services/salesService";
import * as productService from "@/services/productService";
import * as customerService from "@/services/customerService";
import { toast } from "sonner";
import { BarChart3, TrendingUp, Package, Users, DollarSign } from "lucide-react";

const Reports = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, topProducts: [] as any[], recentOrders: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) fetchReports(); }, [user]);

  // API: Gọi nhiều endpoints để lấy báo cáo
  const fetchReports = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, customersData] = await Promise.all([
        salesService.getAll(),      // API: GET /api/sales
        productService.getAll(),    // API: GET /api/products
        customerService.getAll(),   // API: GET /api/customers
      ]);

      const totalRevenue = ordersData?.reduce((sum: number, order: any) => sum + (order.tong_tien_thanh_toan || 0), 0) || 0;

      setStats({
        totalRevenue,
        totalOrders: ordersData?.length || 0,
        totalProducts: productsData?.length || 0,
        totalCustomers: customersData?.length || 0,
        topProducts: [],
        recentOrders: ordersData?.slice(0, 10) || [],
      });
    } catch (error: any) { toast.error(error.message || "Không thể tải báo cáo"); }
    finally { setLoading(false); }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("vi-VN");

  if (authLoading || !user) return null;
  if (loading) return <DashboardLayout><div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6"><h1 className="text-3xl font-bold flex items-center gap-2"><BarChart3 className="w-8 h-8 text-primary" />Báo cáo & Thống kê</h1><p className="text-muted-foreground mt-1">Tổng quan doanh thu và hoạt động kinh doanh</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" />Tổng doanh thu</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</div></CardContent></Card>
          <Card className="shadow-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4" />Đơn hàng</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalOrders}</div></CardContent></Card>
          <Card className="shadow-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Package className="w-4 h-4" />Sản phẩm</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalProducts}</div></CardContent></Card>
          <Card className="shadow-card"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" />Khách hàng</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalCustomers}</div></CardContent></Card>
        </div>
        <Card className="shadow-card"><CardHeader><CardTitle>Đơn hàng gần đây</CardTitle></CardHeader><CardContent>{stats.recentOrders.length === 0 ? <p className="text-muted-foreground text-center py-4">Chưa có đơn hàng</p> : <div className="space-y-3">{stats.recentOrders.map((order: any) => (<div key={order.ma_hdbh} className="p-3 rounded-lg bg-muted/30"><div className="flex justify-between items-start mb-2"><p className="font-medium">{order.ma_hdbh}</p><p className="font-bold text-primary">{formatCurrency(order.tong_tien_thanh_toan)}</p></div><div className="flex justify-between items-center text-sm text-muted-foreground"><span>{formatDate(order.ngay_gio_giao_dich)}</span><span className="capitalize">{order.hinh_thuc_thanh_toan}</span></div></div>))}</div>}</CardContent></Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
