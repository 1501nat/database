import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Employee {
  ma_nv: string;
  ho_ten: string;
  sdt: string;
  email: string;
  ngay_sinh: string;
  gioi_tinh: string;
  ngay_vao_lam: string;
  trang_thai_lam_viec: string;
  ma_cn: string;
}

const Employees = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    ma_nv: "",
    ho_ten: "",
    sdt: "",
    email: "",
    ngay_sinh: "",
    gioi_tinh: "Nam",
    cccd: "",
    dia_chi_thuong_tru: "",
    ngay_vao_lam: "",
    trang_thai_lam_viec: "đang làm",
    ma_cn: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, branchesData] = await Promise.all([
        supabase.from("nhan_vien").select("*").order("ma_nv"),
        supabase.from("chi_nhanh").select("*"),
      ]);

      if (employeesData.error) throw employeesData.error;
      if (branchesData.error) throw branchesData.error;

      setEmployees(employeesData.data || []);
      setBranches(branchesData.data || []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const { error } = await supabase
          .from("nhan_vien")
          .update(formData)
          .eq("ma_nv", editingEmployee.ma_nv);
        if (error) throw error;
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        const { error } = await supabase.from("nhan_vien").insert([formData]);
        if (error) throw error;
        toast.success("Thêm nhân viên thành công!");
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (ma_nv: string) => {
    if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
    try {
      const { error } = await supabase.from("nhan_vien").delete().eq("ma_nv", ma_nv);
      if (error) throw error;
      toast.success("Xóa nhân viên thành công!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa nhân viên");
    }
  };

  const resetForm = () => {
    setFormData({
      ma_nv: "",
      ho_ten: "",
      sdt: "",
      email: "",
      ngay_sinh: "",
      gioi_tinh: "Nam",
      cccd: "",
      dia_chi_thuong_tru: "",
      ngay_vao_lam: "",
      trang_thai_lam_viec: "đang làm",
      ma_cn: "",
    });
    setEditingEmployee(null);
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      ma_nv: employee.ma_nv,
      ho_ten: employee.ho_ten,
      sdt: employee.sdt || "",
      email: employee.email || "",
      ngay_sinh: employee.ngay_sinh || "",
      gioi_tinh: employee.gioi_tinh || "Nam",
      cccd: "",
      dia_chi_thuong_tru: "",
      ngay_vao_lam: employee.ngay_vao_lam || "",
      trang_thai_lam_viec: employee.trang_thai_lam_viec || "đang làm",
      ma_cn: employee.ma_cn,
    });
    setDialogOpen(true);
  };

  const columns = [
    { header: "Mã NV", accessor: "ma_nv" as keyof Employee },
    { header: "Họ tên", accessor: "ho_ten" as keyof Employee },
    { header: "Số điện thoại", accessor: "sdt" as keyof Employee },
    { header: "Email", accessor: "email" as keyof Employee },
    {
      header: "Trạng thái",
      accessor: ((row: Employee) => (
        <Badge variant={row.trang_thai_lam_viec === "đang làm" ? "default" : "secondary"}>
          {row.trang_thai_lam_viec}
        </Badge>
      )) as any,
    },
    {
      header: "Thao tác",
      accessor: ((row: Employee) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.ma_nv)}>
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
              <Users className="w-8 h-8 text-primary" />
              Quản lý nhân viên
            </h1>
            <p className="text-muted-foreground mt-1">Danh sách và quản lý nhân viên</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mã nhân viên *</Label>
                      <Input value={formData.ma_nv} onChange={(e) => setFormData({ ...formData, ma_nv: e.target.value })} disabled={!!editingEmployee} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Họ tên *</Label>
                      <Input value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input value={formData.sdt} onChange={(e) => setFormData({ ...formData, sdt: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ngày sinh</Label>
                      <Input type="date" value={formData.ngay_sinh} onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Giới tính</Label>
                      <Select value={formData.gioi_tinh} onValueChange={(value) => setFormData({ ...formData, gioi_tinh: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ngày vào làm</Label>
                      <Input type="date" value={formData.ngay_vao_lam} onChange={(e) => setFormData({ ...formData, ngay_vao_lam: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Chi nhánh *</Label>
                      <Select value={formData.ma_cn} onValueChange={(value) => setFormData({ ...formData, ma_cn: value })} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chi nhánh" />
                        </SelectTrigger>
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
                </div>
                <DialogFooter>
                  <Button type="submit">{editingEmployee ? "Cập nhật" : "Thêm mới"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <DataTable data={employees} columns={columns} loading={loading} emptyMessage="Chưa có nhân viên nào" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
