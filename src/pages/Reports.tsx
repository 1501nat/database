import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BarChart3, TrendingUp, Package, Users, DollarSign } from "lucide-react";

const Reports = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    topProducts: [] as any[],
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [ordersData, productsData, customersData, orderDetailsData] = await Promise.all([
        supabase.from("hoa_don_ban_hang").select("*").order("ngay_gio_giao_dich", { ascending: false }).limit(10),
        supabase.from("san_pham").select("ma_sp, ten_sp"),
        supabase.from("khach_hang").select("ma_kh"),
        supabase.from("chi_tiet_hdbh").select("ma_sp, so_luong_ban"),
      ]);

      if (ordersData.error) throw ordersData.error;
      if (productsData.error) throw productsData.error;
      if (customersData.error) throw customersData.error;
      if (orderDetailsData.error) throw orderDetailsData.error;

      const totalRevenue = ordersData.data?.reduce((sum, order) => sum + (order.tong_tien_thanh_toan || 0), 0) || 0;

      // Calculate top selling products
      const productSales: Record<string, number> = {};
      orderDetailsData.data?.forEach((detail) => {
        productSales[detail.ma_sp] = (productSales[detail.ma_sp] || 0) + detail.so_luong_ban;
      });

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([ma_sp, quantity]) => {
          const product = productsData.data?.find((p) => p.ma_sp === ma_sp);
          return {
            ma_sp,
            ten_sp: product?.ten_sp || ma_sp,
            so_luong_ban: quantity,
          };
        });

      setStats({
        totalRevenue,
        totalOrders: ordersData.data?.length || 0,
        totalProducts: productsData.data?.length || 0,
        totalCustomers: customersData.data?.length || 0,
        topProducts,
        recentOrders: ordersData.data || [],
      });
    } catch (error: any) {
      toast.error(error.message || "Không thể tải báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (authLoading || !user) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Báo cáo & Thống kê
          </h1>
          <p className="text-muted-foreground mt-1">Tổng quan doanh thu và hoạt động kinh doanh</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Tổng doanh thu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Top sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-3">
                  {stats.topProducts.map((product, index) => (
                    <div key={product.ma_sp} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.ten_sp}</p>
                        <p className="text-sm text-muted-foreground">Mã: {product.ma_sp}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{product.so_luong_ban}</p>
                        <p className="text-xs text-muted-foreground">đã bán</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Chưa có đơn hàng</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order.ma_hdbh} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{order.ma_hdbh}</p>
                        <p className="font-bold text-primary">{formatCurrency(order.tong_tien_thanh_toan)}</p>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{formatDate(order.ngay_gio_giao_dich)}</span>
                        <span className="capitalize">{order.hinh_thuc_thanh_toan}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
