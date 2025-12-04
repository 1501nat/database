/**
 * Categories Page - Trang quản lý danh mục
 * @api-connections:
 *   - GET /api/categories - Lấy danh sách danh mục
 *   - POST /api/categories - Tạo danh mục mới
 *   - PUT /api/categories/:id - Cập nhật danh mục
 *   - DELETE /api/categories/:id - Xóa danh mục
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// API: Import categoryService
import * as categoryService from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { toast } from "sonner";
import { Plus, FolderTree, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Categories = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ ma_dm: "", ten_danh_muc: "", mo_ta: "", ma_dm_super: "" });

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) fetchCategories(); }, [user]);

  // API: GET /api/categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error: any) { toast.error(error.message || "Không thể tải danh sách danh mục"); }
    finally { setLoading(false); }
  };

  // API: POST /api/categories hoặc PUT /api/categories/:id
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, ma_dm_super: formData.ma_dm_super || null };
      if (editingCategory) {
        await categoryService.update(editingCategory.ma_dm, submitData);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await categoryService.create(submitData as Category);
        toast.success("Thêm danh mục thành công!");
      }
      setDialogOpen(false); resetForm(); fetchCategories();
    } catch (error: any) { toast.error(error.message || "Có lỗi xảy ra"); }
  };

  // API: DELETE /api/categories/:id
  const handleDelete = async (ma_dm: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try { await categoryService.remove(ma_dm); toast.success("Xóa danh mục thành công!"); fetchCategories(); }
    catch (error: any) { toast.error(error.message || "Không thể xóa danh mục"); }
  };

  const resetForm = () => { setFormData({ ma_dm: "", ten_danh_muc: "", mo_ta: "", ma_dm_super: "" }); setEditingCategory(null); };
  const openEditDialog = (category: Category) => { setEditingCategory(category); setFormData({ ma_dm: category.ma_dm, ten_danh_muc: category.ten_danh_muc, mo_ta: category.mo_ta || "", ma_dm_super: category.ma_dm_super || "" }); setDialogOpen(true); };
  const getParentName = (ma_dm_super: string | null) => { if (!ma_dm_super) return "-"; const parent = categories.find(c => c.ma_dm === ma_dm_super); return parent?.ten_danh_muc || ma_dm_super; };

  const columns = [
    { header: "Mã danh mục", accessor: "ma_dm" as keyof Category },
    { header: "Tên danh mục", accessor: "ten_danh_muc" as keyof Category },
    { header: "Danh mục cha", accessor: ((row: Category) => <Badge variant={row.ma_dm_super ? "outline" : "secondary"}>{getParentName(row.ma_dm_super)}</Badge>) as any },
    { header: "Mô tả", accessor: ((row: Category) => row.mo_ta || "-") as any },
    { header: "Thao tác", accessor: ((row: Category) => <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => openEditDialog(row)}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="outline" onClick={() => handleDelete(row.ma_dm)}><Trash2 className="w-4 h-4" /></Button></div>) as any },
  ];

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-3xl font-bold flex items-center gap-2"><FolderTree className="w-8 h-8 text-primary" />Quản lý danh mục sản phẩm</h1><p className="text-muted-foreground mt-1">Tổ chức và phân loại sản phẩm theo danh mục</p></div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />Thêm danh mục</Button></DialogTrigger>
            <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit}><div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Mã danh mục *</Label><Input value={formData.ma_dm} onChange={(e) => setFormData({ ...formData, ma_dm: e.target.value })} disabled={!!editingCategory} required /></div>
                <div className="space-y-2"><Label>Tên danh mục *</Label><Input value={formData.ten_danh_muc} onChange={(e) => setFormData({ ...formData, ten_danh_muc: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Danh mục cha</Label><Select value={formData.ma_dm_super || "none"} onValueChange={(value) => setFormData({ ...formData, ma_dm_super: value === "none" ? "" : value })}><SelectTrigger><SelectValue placeholder="Chọn danh mục cha (nếu có)" /></SelectTrigger><SelectContent><SelectItem value="none">Không có</SelectItem>{categories.filter(c => c.ma_dm !== formData.ma_dm).map((cat) => <SelectItem key={cat.ma_dm} value={cat.ma_dm}>{cat.ten_danh_muc}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Mô tả</Label><Textarea value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} rows={3} /></div>
              </div><DialogFooter><Button type="submit">{editingCategory ? "Cập nhật" : "Thêm mới"}</Button></DialogFooter></form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card"><CardContent className="p-6"><DataTable data={categories} columns={columns} loading={loading} emptyMessage="Chưa có danh mục nào" /></CardContent></Card>
      </div>
    </DashboardLayout>
  );
};

export default Categories;