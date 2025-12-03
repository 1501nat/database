import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Store, Edit, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  ma_sp: string;
  ma_cn: string;
  so_luong_ton: number;
  so_luong_toi_da: number;
  so_luong_toi_thieu: number;
  ngay_cap_nhat: string;
  san_pham?: { ten_sp: string; don_vi_tinh: string };
  chi_nhanh?: { ten_cn: string };
}

const Inventory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  
  const [formData, setFormData] = useState({
    ma_sp: "",
    ma_cn: "",
    so_luong_ton: 0,
    so_luong_toi_da: 100,
    so_luong_toi_thieu: 10,
    ngay_cap_nhat: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, selectedBranch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("ton_kho")
        .select(`
          *,
          san_pham:ma_sp(ten_sp, don_vi_tinh),
          chi_nhanh:ma_cn(ten_cn)
        `);
      
      if (selectedBranch !== "all") {
        query = query.eq("ma_cn", selectedBranch);
      }

      const [inventoryData, productsData, branchesData] = await Promise.all([
        query.order("so_luong_ton"),
        supabase.from("san_pham").select("*"),
        supabase.from("chi_nhanh").select("*"),
      ]);

      if (inventoryData.error) throw inventoryData.error;
      if (productsData.error) throw productsData.error;
      if (branchesData.error) throw branchesData.error;

      setInventory(inventoryData.data || []);
      setProducts(productsData.data || []);
      setBranches(branchesData.data || []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải dữ liệu tồn kho");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("ton_kho")
          .update(formData)
          .eq("ma_sp", editingItem.ma_sp)
          .eq("ma_cn", editingItem.ma_cn);
        if (error) throw error;
        toast.success("Cập nhật tồn kho thành công!");
      } else {
        const { error } = await supabase.from("ton_kho").insert([formData]);
        if (error) throw error;
        toast.success("Thêm tồn kho thành công!");
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const resetForm = () => {
    setFormData({
      ma_sp: "",
      ma_cn: "",
      so_luong_ton: 0,
      so_luong_toi_da: 100,
      so_luong_toi_thieu: 10,
      ngay_cap_nhat: new Date().toISOString().split('T')[0],
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      ma_sp: item.ma_sp,
      ma_cn: item.ma_cn,
      so_luong_ton: item.so_luong_ton || 0,
      so_luong_toi_da: item.so_luong_toi_da || 100,
      so_luong_toi_thieu: item.so_luong_toi_thieu || 10,
      ngay_cap_nhat: new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.so_luong_ton <= (item.so_luong_toi_thieu || 0)) {
      return { label: "Sắp hết", variant: "destructive" as const, icon: AlertTriangle };
    }
    if (item.so_luong_ton >= (item.so_luong_toi_da || 100)) {
      return { label: "Đầy kho", variant: "secondary" as const, icon: TrendingUp };
    }
    return { label: "Bình thường", variant: "default" as const, icon: Store };
  };

  const columns = [
    {
      header: "Sản phẩm",
      accessor: ((row: InventoryItem) => row.san_pham?.ten_sp || row.ma_sp) as any,
    },
    {
      header: "Chi nhánh",
      accessor: ((row: InventoryItem) => row.chi_nhanh?.ten_cn || row.ma_cn) as any,
    },
    {
      header: "Số lượng tồn",
      accessor: ((row: InventoryItem) => (
        <div className="font-semibold text-lg">
          {row.so_luong_ton} {row.san_pham?.don_vi_tinh || ""}
        </div>
      )) as any,
    },
    {
      header: "Tối thiểu",
      accessor: ((row: InventoryItem) => `${row.so_luong_toi_thieu || 0}`) as any,
    },
    {
      header: "Tối đa",
      accessor: ((row: InventoryItem) => `${row.so_luong_toi_da || 0}`) as any,
    },
    {
      header: "Trạng thái",
      accessor: ((row: InventoryItem) => {
        const status = getStockStatus(row);
        const Icon = status.icon;
        return (
          <Badge variant={status.variant} className="gap-1">
            <Icon className="w-3 h-3" />
            {status.label}
          </Badge>
        );
      }) as any,
    },
    {
      header: "Thao tác",
      accessor: ((row: InventoryItem) => (
        <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
          <Edit className="w-4 h-4" />
        </Button>
      )) as any,
    },
  ];

  const lowStockCount = inventory.filter(
    (item) => item.so_luong_ton <= (item.so_luong_toi_thieu || 0)
  ).length;

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="w-8 h-8 text-primary" />
              Quản lý tồn kho
            </h1>
            <p className="text-muted-foreground mt-1">Theo dõi và quản lý tồn kho theo chi nhánh</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm tồn kho
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Cập nhật tồn kho" : "Thêm tồn kho mới"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sản phẩm *</Label>
                      <Select 
                        value={formData.ma_sp} 
                        onValueChange={(value) => setFormData({ ...formData, ma_sp: value })} 
                        disabled={!!editingItem}
                        required
                      >
                        <SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.ma_sp} value={product.ma_sp}>
                              {product.ten_sp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Chi nhánh *</Label>
                      <Select 
                        value={formData.ma_cn} 
                        onValueChange={(value) => setFormData({ ...formData, ma_cn: value })} 
                        disabled={!!editingItem}
                        required
                      >
                        <SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.ma_cn} value={branch.ma_cn}>
                              {branch.ten_cn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Số lượng tồn *</Label>
                      <Input 
                        type="number" 
                        value={formData.so_luong_ton} 
                        onChange={(e) => setFormData({ ...formData, so_luong_ton: parseInt(e.target.value) || 0 })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tối thiểu</Label>
                      <Input 
                        type="number" 
                        value={formData.so_luong_toi_thieu} 
                        onChange={(e) => setFormData({ ...formData, so_luong_toi_thieu: parseInt(e.target.value) || 0 })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tối đa</Label>
                      <Input 
                        type="number" 
                        value={formData.so_luong_toi_da} 
                        onChange={(e) => setFormData({ ...formData, so_luong_toi_da: parseInt(e.target.value) || 0 })} 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingItem ? "Cập nhật" : "Thêm mới"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng mặt hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-warning bg-warning/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning">Sắp hết hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{lowStockCount}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lọc theo chi nhánh</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.ma_cn} value={branch.ma_cn}>
                      {branch.ten_cn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <DataTable 
              data={inventory} 
              columns={columns} 
              loading={loading} 
              emptyMessage="Chưa có dữ liệu tồn kho" 
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
