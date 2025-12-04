/**
 * Products Page - Trang quản lý sản phẩm
 * @description CRUD sản phẩm
 * @api-connections:
 *   - GET /api/products - Lấy danh sách sản phẩm
 *   - GET /api/categories - Lấy danh sách danh mục
 *   - POST /api/products - Tạo sản phẩm mới
 *   - PUT /api/products/:id - Cập nhật sản phẩm
 *   - DELETE /api/products/:id - Xóa sản phẩm
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
// API: Import services thay vì Supabase
import * as productService from "@/services/productService";
import * as categoryService from "@/services/categoryService";
import { Product } from "@/services/productService";
import { Category } from "@/services/categoryService";
import { toast } from "sonner";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    ma_sp: "",
    ten_sp: "",
    mo_ta: "",
    don_vi_tinh: "cái",
    gia_ban_le: 0,
    ma_vach: "",
    trang_thai_sp: "đang KD",
    ma_dm: "",
    ngay_them_vao: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  /**
   * Lấy dữ liệu sản phẩm và danh mục
   * @api GET /api/products
   * @api GET /api/categories
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      // API: Gọi song song 2 endpoints
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),   // API: GET /api/products
        categoryService.getAll(),  // API: GET /api/categories
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý submit form
   * @api POST /api/products (thêm mới)
   * @api PUT /api/products/:id (cập nhật)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // API: PUT /api/products/:id
        await productService.update(editingProduct.ma_sp, formData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // API: POST /api/products
        await productService.create(formData as Product);
        toast.success("Thêm sản phẩm thành công!");
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  /**
   * Xóa sản phẩm
   * @api DELETE /api/products/:id
   */
  const handleDelete = async (ma_sp: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      // API: DELETE /api/products/:id
      await productService.remove(ma_sp);
      toast.success("Xóa sản phẩm thành công!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa sản phẩm");
    }
  };

  const resetForm = () => {
    setFormData({
      ma_sp: "",
      ten_sp: "",
      mo_ta: "",
      don_vi_tinh: "cái",
      gia_ban_le: 0,
      ma_vach: "",
      trang_thai_sp: "đang KD",
      ma_dm: "",
      ngay_them_vao: new Date().toISOString().split('T')[0],
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ma_sp: product.ma_sp,
      ten_sp: product.ten_sp,
      mo_ta: product.mo_ta || "",
      don_vi_tinh: product.don_vi_tinh || "cái",
      gia_ban_le: product.gia_ban_le || 0,
      ma_vach: product.ma_vach || "",
      trang_thai_sp: product.trang_thai_sp || "đang KD",
      ma_dm: product.ma_dm,
      ngay_them_vao: new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const columns = [
    { header: "Mã SP", accessor: "ma_sp" as keyof Product },
    { header: "Tên sản phẩm", accessor: "ten_sp" as keyof Product },
    { header: "Đơn vị", accessor: "don_vi_tinh" as keyof Product },
    {
      header: "Giá bán",
      accessor: ((row: Product) => formatCurrency(row.gia_ban_le || 0)) as any,
    },
    {
      header: "Trạng thái",
      accessor: ((row: Product) => (
        <Badge variant={row.trang_thai_sp === "đang KD" ? "default" : "secondary"}>
          {row.trang_thai_sp}
        </Badge>
      )) as any,
    },
    {
      header: "Thao tác",
      accessor: ((row: Product) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.ma_sp)}>
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
              <Package className="w-8 h-8 text-primary" />
              Quản lý sản phẩm
            </h1>
            <p className="text-muted-foreground mt-1">Danh sách và quản lý sản phẩm</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mã sản phẩm *</Label>
                      <Input value={formData.ma_sp} onChange={(e) => setFormData({ ...formData, ma_sp: e.target.value })} disabled={!!editingProduct} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Tên sản phẩm *</Label>
                      <Input value={formData.ten_sp} onChange={(e) => setFormData({ ...formData, ten_sp: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Đơn vị tính</Label>
                      <Input value={formData.don_vi_tinh} onChange={(e) => setFormData({ ...formData, don_vi_tinh: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Giá bán lẻ</Label>
                      <Input type="number" value={formData.gia_ban_le} onChange={(e) => setFormData({ ...formData, gia_ban_le: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Mã vạch</Label>
                      <Input value={formData.ma_vach} onChange={(e) => setFormData({ ...formData, ma_vach: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Danh mục *</Label>
                    <Select value={formData.ma_dm} onValueChange={(value) => setFormData({ ...formData, ma_dm: value })} required>
                      <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.ma_dm} value={cat.ma_dm}>{cat.ten_danh_muc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingProduct ? "Cập nhật" : "Thêm mới"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <DataTable data={products} columns={columns} loading={loading} emptyMessage="Chưa có sản phẩm nào" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Products;
