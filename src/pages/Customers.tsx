import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, UserCircle, Edit, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Customer {
  ma_kh: string;
  ho_ten: string;
  sdt: string;
  email: string;
  dia_chi: string;
  hang_thanh_vien: string;
  diem_tich_luy: number;
}

const Customers = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    ma_kh: "",
    ho_ten: "",
    sdt: "",
    email: "",
    gioi_tinh: "Nam",
    ngay_sinh: "",
    dia_chi: "",
    ngay_dang_ky: new Date().toISOString().split('T')[0],
    hang_thanh_vien: "thường",
    diem_tich_luy: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchCustomers();
  }, [user]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("khach_hang")
        .select("*")
        .order("ma_kh");
      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        const { error } = await supabase
          .from("khach_hang")
          .update(formData)
          .eq("ma_kh", editingCustomer.ma_kh);
        if (error) throw error;
        toast.success("Cập nhật khách hàng thành công!");
      } else {
        const { error } = await supabase.from("khach_hang").insert([formData]);
        if (error) throw error;
        toast.success("Thêm khách hàng thành công!");
      }
      setDialogOpen(false);
      resetForm();
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (ma_kh: string) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      const { error } = await supabase.from("khach_hang").delete().eq("ma_kh", ma_kh);
      if (error) throw error;
      toast.success("Xóa khách hàng thành công!");
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa khách hàng");
    }
  };

  const resetForm = () => {
    setFormData({
      ma_kh: "",
      ho_ten: "",
      sdt: "",
      email: "",
      gioi_tinh: "Nam",
      ngay_sinh: "",
      dia_chi: "",
      ngay_dang_ky: new Date().toISOString().split('T')[0],
      hang_thanh_vien: "thường",
      diem_tich_luy: 0,
    });
    setEditingCustomer(null);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      ma_kh: customer.ma_kh,
      ho_ten: customer.ho_ten,
      sdt: customer.sdt || "",
      email: customer.email || "",
      gioi_tinh: "Nam",
      ngay_sinh: "",
      dia_chi: customer.dia_chi || "",
      ngay_dang_ky: new Date().toISOString().split('T')[0],
      hang_thanh_vien: customer.hang_thanh_vien || "thường",
      diem_tich_luy: customer.diem_tich_luy || 0,
    });
    setDialogOpen(true);
  };

  const getMemberBadge = (tier: string) => {
    const colors: Record<string, string> = {
      "thường": "secondary",
      "bạc": "outline",
      "vàng": "default",
      "VIP": "destructive",
    };
    return <Badge variant={colors[tier] as any}>{tier}</Badge>;
  };

  const columns = [
    { header: "Mã KH", accessor: "ma_kh" as keyof Customer },
    { header: "Họ tên", accessor: "ho_ten" as keyof Customer },
    { header: "Số điện thoại", accessor: "sdt" as keyof Customer },
    { header: "Email", accessor: "email" as keyof Customer },
    {
      header: "Hạng thành viên",
      accessor: ((row: Customer) => getMemberBadge(row.hang_thanh_vien)) as any,
    },
    {
      header: "Điểm tích lũy",
      accessor: ((row: Customer) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          {row.diem_tich_luy}
        </div>
      )) as any,
    },
    {
      header: "Thao tác",
      accessor: ((row: Customer) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.ma_kh)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )) as any,
    },
  ];

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserCircle className="w-8 h-8 text-primary" />
              Quản lý khách hàng
            </h1>
            <p className="text-muted-foreground mt-1">Danh sách và quản lý khách hàng</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm khách hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mã khách hàng *</Label>
                      <Input value={formData.ma_kh} onChange={(e) => setFormData({ ...formData, ma_kh: e.target.value })} disabled={!!editingCustomer} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Họ tên *</Label>
                      <Input value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Số điện thoại *</Label>
                      <Input value={formData.sdt} onChange={(e) => setFormData({ ...formData, sdt: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Địa chỉ</Label>
                    <Input value={formData.dia_chi} onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hạng thành viên</Label>
                      <Select value={formData.hang_thanh_vien} onValueChange={(value) => setFormData({ ...formData, hang_thanh_vien: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thường">Thường</SelectItem>
                          <SelectItem value="bạc">Bạc</SelectItem>
                          <SelectItem value="vàng">Vàng</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Điểm tích lũy</Label>
                      <Input type="number" value={formData.diem_tich_luy} onChange={(e) => setFormData({ ...formData, diem_tich_luy: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingCustomer ? "Cập nhật" : "Thêm mới"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <DataTable data={customers} columns={columns} loading={loading} emptyMessage="Chưa có khách hàng nào" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
