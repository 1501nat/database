import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    branches: 0,
    employees: 0,
    products: 0,
    customers: 0,
    lowStockItems: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [branches, employees, products, customers, inventory] = await Promise.all([
          supabase.from("chi_nhanh").select("ma_cn", { count: "exact" }),
          supabase.from("nhan_vien").select("ma_nv", { count: "exact" }),
          supabase.from("san_pham").select("ma_sp", { count: "exact" }),
          supabase.from("khach_hang").select("ma_kh", { count: "exact" }),
          supabase.from("ton_kho").select("*").lt("so_luong_ton", 10),
        ]);

        setStats({
          branches: branches.count || 0,
          employees: employees.count || 0,
          products: products.count || 0,
          customers: customers.count || 0,
          lowStockItems: inventory.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: "Chi nhánh",
      value: stats.branches,
      icon: Store,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Nhân viên",
      value: stats.employees,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Sản phẩm",
      value: stats.products,
      icon: Package,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Khách hàng",
      value: stats.customers,
      icon: ShoppingCart,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tổng quan</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là bảng điều khiển quản lý cửa hàng của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        {stats.lowStockItems > 0 && (
          <Card className="border-warning bg-warning/5 shadow-card mb-8">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="w-6 h-6 text-warning" />
              <div>
                <h3 className="font-semibold text-warning">Cảnh báo tồn kho</h3>
                <p className="text-sm text-muted-foreground">
                  Có {stats.lowStockItems} sản phẩm sắp hết hàng. Vui lòng kiểm tra và nhập thêm.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                Tạo đơn hàng mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bắt đầu tạo hóa đơn bán hàng mới cho khách
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Package className="w-5 h-5 text-success" />
                </div>
                Nhập hàng mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ghi nhận phiếu nhập hàng từ nhà cung cấp
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
                  <Users className="w-5 h-5 text-info" />
                </div>
                Thêm khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Đăng ký thông tin khách hàng mới vào hệ thống
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;
