/**
 * Promotions Page - Trang quản lý khuyến mãi
 * @api-connections:
 *   - GET /api/promotions - Lấy danh sách khuyến mãi
 *   - POST /api/promotions - Tạo khuyến mãi mới
 *   - PUT /api/promotions/:id - Cập nhật khuyến mãi
 *   - DELETE /api/promotions/:id - Xóa khuyến mãi
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// API: Import promotionService
import * as promotionService from "@/services/promotionService";
import { Promotion } from "@/services/promotionService";
import { toast } from "sonner";
import { Plus, Percent, Edit, Trash2, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const Promotions = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({ ma_ctkm: "", ten_chuong_trinh: "", mo_ta: "", loai_khuyen_mai: "phan_tram", gia_tri_khuyen_mai: 0, ngay_bat_dau: "", ngay_ket_thuc: "", trang_thai_ct: "chua_bat_dau" });

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) fetchPromotions(); }, [user]);

  // API: GET /api/promotions
  const fetchPromotions = async () => {
    try { setLoading(true); const data = await promotionService.getAll(); setPromotions(data || []); }
    catch (error: any) { toast.error(error.message || "Không thể tải danh sách khuyến mãi"); }
    finally { setLoading(false); }
  };

  // API: POST /api/promotions hoặc PUT /api/promotions/:id
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromotion) { await promotionService.update(editingPromotion.ma_ctkm, formData); toast.success("Cập nhật khuyến mãi thành công!"); }
      else { await promotionService.create(formData as Promotion); toast.success("Thêm khuyến mãi thành công!"); }
      setDialogOpen(false); resetForm(); fetchPromotions();
    } catch (error: any) { toast.error(error.message || "Có lỗi xảy ra"); }
  };

  // API: DELETE /api/promotions/:id
  const handleDelete = async (ma_ctkm: string) => {
    if (!confirm("Bạn có chắc muốn xóa chương trình khuyến mãi này?")) return;
    try { await promotionService.remove(ma_ctkm); toast.success("Xóa khuyến mãi thành công!"); fetchPromotions(); }
    catch (error: any) { toast.error(error.message || "Không thể xóa khuyến mãi"); }
  };

  const resetForm = () => { setFormData({ ma_ctkm: "", ten_chuong_trinh: "", mo_ta: "", loai_khuyen_mai: "phan_tram", gia_tri_khuyen_mai: 0, ngay_bat_dau: "", ngay_ket_thuc: "", trang_thai_ct: "chua_bat_dau" }); setEditingPromotion(null); };
  const openEditDialog = (promotion: Promotion) => { setEditingPromotion(promotion); setFormData({ ma_ctkm: promotion.ma_ctkm, ten_chuong_trinh: promotion.ten_chuong_trinh, mo_ta: promotion.mo_ta || "", loai_khuyen_mai: promotion.loai_khuyen_mai || "phan_tram", gia_tri_khuyen_mai: promotion.gia_tri_khuyen_mai || 0, ngay_bat_dau: promotion.ngay_bat_dau?.split('T')[0] || "", ngay_ket_thuc: promotion.ngay_ket_thuc?.split('T')[0] || "", trang_thai_ct: promotion.trang_thai_ct || "chua_bat_dau" }); setDialogOpen(true); };
  const getStatusBadge = (status: string | null) => { const map: Record<string, any> = { "chua_bat_dau": { variant: "secondary", label: "Chưa bắt đầu" }, "chưa bắt đầu": { variant: "secondary", label: "Chưa bắt đầu" }, "dang_dien_ra": { variant: "default", label: "Đang diễn ra" }, "đang diễn ra": { variant: "default", label: "Đang diễn ra" }, "da_ket_thuc": { variant: "outline", label: "Đã kết thúc" }, "đã kết thúc": { variant: "outline", label: "Đã kết thúc" } }; const s = map[status || "chua_bat_dau"] || map["chua_bat_dau"]; return <Badge variant={s.variant}>{s.label}</Badge>; };
  const formatDate = (dateStr: string) => { try { return format(new Date(dateStr), "dd/MM/yyyy", { locale: vi }); } catch { return dateStr; } };
  const formatDiscount = (type: string | null, value: number | null) => { if (!value) return "-"; if (type === "phan_tram") return `${value}%`; return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value); };

  const activePromotions = promotions.filter(p => p.trang_thai_ct === "đang diễn ra").length;
  const upcomingPromotions = promotions.filter(p => p.trang_thai_ct === "chưa bắt đầu").length;

  const columns = [
    { header: "Mã CTKM", accessor: "ma_ctkm" as keyof Promotion },
    { header: "Tên chương trình", accessor: "ten_chuong_trinh" as keyof Promotion },
    { header: "Giảm giá", accessor: ((row: Promotion) => <div className="flex items-center gap-1"><Tag className="w-4 h-4 text-primary" />{formatDiscount(row.loai_khuyen_mai, row.gia_tri_khuyen_mai)}</div>) as any },
    { header: "Thời gian", accessor: ((row: Promotion) => <div className="flex items-center gap-1 text-sm"><Calendar className="w-4 h-4 text-muted-foreground" />{formatDate(row.ngay_bat_dau)} - {formatDate(row.ngay_ket_thuc)}</div>) as any },
    { header: "Trạng thái", accessor: ((row: Promotion) => getStatusBadge(row.trang_thai_ct)) as any },
    { header: "Thao tác", accessor: ((row: Promotion) => <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => openEditDialog(row)}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="outline" onClick={() => handleDelete(row.ma_ctkm)}><Trash2 className="w-4 h-4" /></Button></div>) as any },
  ];

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-3xl font-bold flex items-center gap-2"><Percent className="w-8 h-8 text-primary" />Quản lý khuyến mãi</h1><p className="text-muted-foreground mt-1">Tạo và quản lý các chương trình khuyến mãi</p></div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />Thêm khuyến mãi</Button></DialogTrigger>
            <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editingPromotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit}><div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Mã chương trình *</Label><Input value={formData.ma_ctkm} onChange={(e) => setFormData({ ...formData, ma_ctkm: e.target.value })} disabled={!!editingPromotion} required /></div><div className="space-y-2"><Label>Tên chương trình *</Label><Input value={formData.ten_chuong_trinh} onChange={(e) => setFormData({ ...formData, ten_chuong_trinh: e.target.value })} required /></div></div>
                <div className="space-y-2"><Label>Mô tả</Label><Textarea value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} rows={2} /></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Loại khuyến mãi</Label><Select value={formData.loai_khuyen_mai} onValueChange={(v) => setFormData({ ...formData, loai_khuyen_mai: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="phan_tram">Giảm theo %</SelectItem><SelectItem value="tien_mat">Giảm tiền mặt</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Giá trị giảm</Label><Input type="number" value={formData.gia_tri_khuyen_mai} onChange={(e) => setFormData({ ...formData, gia_tri_khuyen_mai: parseFloat(e.target.value) || 0 })} /></div></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Ngày bắt đầu *</Label><Input type="date" value={formData.ngay_bat_dau} onChange={(e) => setFormData({ ...formData, ngay_bat_dau: e.target.value })} required /></div><div className="space-y-2"><Label>Ngày kết thúc *</Label><Input type="date" value={formData.ngay_ket_thuc} onChange={(e) => setFormData({ ...formData, ngay_ket_thuc: e.target.value })} required /></div></div>
                <div className="space-y-2"><Label>Trạng thái</Label><Select value={formData.trang_thai_ct} onValueChange={(v) => setFormData({ ...formData, trang_thai_ct: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="chua_bat_dau">Chưa bắt đầu</SelectItem><SelectItem value="dang_dien_ra">Đang diễn ra</SelectItem><SelectItem value="da_ket_thuc">Đã kết thúc</SelectItem></SelectContent></Select></div>
              </div><DialogFooter><Button type="submit">{editingPromotion ? "Cập nhật" : "Thêm mới"}</Button></DialogFooter></form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tổng chương trình</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{promotions.length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Đang diễn ra</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{activePromotions}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Sắp diễn ra</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{upcomingPromotions}</p></CardContent></Card></div>
        <Card className="shadow-card"><CardContent className="p-6"><DataTable data={promotions} columns={columns} loading={loading} emptyMessage="Chưa có chương trình khuyến mãi nào" /></CardContent></Card>
      </div>
    </DashboardLayout>
  );
};

export default Promotions;