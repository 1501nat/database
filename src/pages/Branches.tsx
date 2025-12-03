import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Building2, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Branch {
  ma_cn: string;
  ten_cn: string;
  dia_chi: string;
  sdt: string;
  ngay_mo_cua: string;
  trang_thai_hoat_dong: string;
}

const Branches = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  
  const [formData, setFormData] = useState({
    ma_cn: "",
    ten_cn: "",
    so_nha_duong: "",
    phuong_xa: "",
    quan_huyen: "",
    tinh_thanh: "",
    dia_chi: "",
    sdt: "",
    ngay_mo_cua: "",
    trang_thai_hoat_dong: "đang hoạt động",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBranches();
    }
  }, [user]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chi_nhanh")
        .select("*")
        .order("ma_cn");

      if (error) throw error;
      setBranches(data || []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách chi nhánh");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        const { error } = await supabase
          .from("chi_nhanh")
          .update(formData)
          .eq("ma_cn", editingBranch.ma_cn);

        if (error) throw error;
        toast.success("Cập nhật chi nhánh thành công!");
      } else {
        const { error } = await supabase
          .from("chi_nhanh")
          .insert([formData]);

        if (error) throw error;
        toast.success("Thêm chi nhánh mới thành công!");
      }

      setDialogOpen(false);
      resetForm();
      fetchBranches();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (ma_cn: string) => {
    if (!confirm("Bạn có chắc muốn xóa chi nhánh này?")) return;

    try {
      const { error } = await supabase
        .from("chi_nhanh")
        .delete()
        .eq("ma_cn", ma_cn);

      if (error) throw error;
      toast.success("Xóa chi nhánh thành công!");
      fetchBranches();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa chi nhánh");
    }
  };

  const resetForm = () => {
    setFormData({
      ma_cn: "",
      ten_cn: "",
      so_nha_duong: "",
      phuong_xa: "",
      quan_huyen: "",
      tinh_thanh: "",
      dia_chi: "",
      sdt: "",
      ngay_mo_cua: "",
      trang_thai_hoat_dong: "đang hoạt động",
    });
    setEditingBranch(null);
  };

  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      ma_cn: branch.ma_cn,
      ten_cn: branch.ten_cn,
      so_nha_duong: "",
      phuong_xa: "",
      quan_huyen: "",
      tinh_thanh: "",
      dia_chi: branch.dia_chi || "",
      sdt: branch.sdt || "",
      ngay_mo_cua: branch.ngay_mo_cua || "",
      trang_thai_hoat_dong: branch.trang_thai_hoat_dong || "đang hoạt động",
    });
    setDialogOpen(true);
  };

  const columns = [
    { header: "Mã CN", accessor: "ma_cn" as keyof Branch },
    { header: "Tên chi nhánh", accessor: "ten_cn" as keyof Branch },
    { header: "Địa chỉ", accessor: "dia_chi" as keyof Branch },
    { header: "Số điện thoại", accessor: "sdt" as keyof Branch },
    { header: "Ngày mở cửa", accessor: "ngay_mo_cua" as keyof Branch },
    {
      header: "Trạng thái",
      accessor: ((row: Branch) => (
        <Badge variant={row.trang_thai_hoat_dong === "đang hoạt động" ? "default" : "secondary"}>
          {row.trang_thai_hoat_dong}
        </Badge>
      )) as any,
    },
    {
      header: "Thao tác",
      accessor: ((row: Branch) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditDialog(row)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.ma_cn)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )) as any,
    },
  ];

  if (authLoading || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" />
              Quản lý chi nhánh
            </h1>
            <p className="text-muted-foreground mt-1">
              Danh sách và quản lý các chi nhánh cửa hàng
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm chi nhánh
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBranch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
                </DialogTitle>
                <DialogDescription>
                  Điền thông tin chi nhánh cửa hàng
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ma_cn">Mã chi nhánh *</Label>
                      <Input
                        id="ma_cn"
                        value={formData.ma_cn}
                        onChange={(e) => setFormData({ ...formData, ma_cn: e.target.value })}
                        disabled={!!editingBranch}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ten_cn">Tên chi nhánh *</Label>
                      <Input
                        id="ten_cn"
                        value={formData.ten_cn}
                        onChange={(e) => setFormData({ ...formData, ten_cn: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dia_chi">Địa chỉ</Label>
                    <Input
                      id="dia_chi"
                      value={formData.dia_chi}
                      onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sdt">Số điện thoại</Label>
                      <Input
                        id="sdt"
                        value={formData.sdt}
                        onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ngay_mo_cua">Ngày mở cửa</Label>
                      <Input
                        id="ngay_mo_cua"
                        type="date"
                        value={formData.ngay_mo_cua}
                        onChange={(e) => setFormData({ ...formData, ngay_mo_cua: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingBranch ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <DataTable
              data={branches}
              columns={columns}
              loading={loading}
              emptyMessage="Chưa có chi nhánh nào"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Branches;
