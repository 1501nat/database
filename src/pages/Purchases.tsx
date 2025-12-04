/**
 * Purchases Page - Trang nhập hàng
 * @api-connections:
 *   - GET /api/products - Lấy danh sách sản phẩm
 *   - GET /api/suppliers - Lấy danh sách nhà cung cấp
 *   - GET /api/branches - Lấy danh sách chi nhánh
 *   - GET /api/employees - Lấy danh sách nhân viên
 *   - POST /api/purchases - Tạo phiếu nhập mới
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as productService from "@/services/productService";
import * as branchService from "@/services/branchService";
import * as employeeService from "@/services/employeeService";
import * as purchaseService from "@/services/purchaseService";
import { toast } from "sonner";
import { Package, Plus, Trash2, FileInput, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Supplier {
  ma_ncc: string;
  ten_cong_ty: string;
}

interface CartItem {
  ma_sp: string;
  ten_sp: string;
  don_gia_nhap: number;
  so_luong_nhap: number;
  thanh_tien: number;
}

const Purchases = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form data
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) { fetchData(); fetchPurchases(); } }, [user]);

  const fetchData = async () => {
    try {
      const [productsData, branchesData, employeesData] = await Promise.all([
        productService.getAll(),
        branchService.getAll(),
        employeeService.getAll(),
      ]);
      setProducts(productsData || []);
      setBranches(branchesData || []);
      setEmployees(employeesData || []);
      // Fetch suppliers using API
      const suppliersRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/suppliers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải dữ liệu");
    }
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getAll();
      setPurchases(data || []);
    } catch (error: any) {
      // If 404, no purchases yet
      if (!error.message?.includes('404')) {
        toast.error(error.message || "Không thể tải danh sách phiếu nhập");
      }
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!selectedProduct) { toast.error("Vui lòng chọn sản phẩm"); return; }
    if (unitPrice <= 0) { toast.error("Vui lòng nhập đơn giá nhập"); return; }
    const product = products.find((p) => p.ma_sp === selectedProduct);
    if (!product) return;

    const existingItem = cart.find((item) => item.ma_sp === selectedProduct);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.ma_sp === selectedProduct
          ? { ...item, so_luong_nhap: item.so_luong_nhap + quantity, thanh_tien: (item.so_luong_nhap + quantity) * item.don_gia_nhap }
          : item
      ));
    } else {
      setCart([...cart, {
        ma_sp: product.ma_sp,
        ten_sp: product.ten_sp,
        don_gia_nhap: unitPrice,
        so_luong_nhap: quantity,
        thanh_tien: unitPrice * quantity
      }]);
    }
    setSelectedProduct("");
    setQuantity(1);
    setUnitPrice(0);
    toast.success("Đã thêm vào phiếu nhập");
  };

  const removeFromCart = (ma_sp: string) => {
    setCart(cart.filter((item) => item.ma_sp !== ma_sp));
  };

  const updateCartItem = (ma_sp: string, field: 'so_luong_nhap' | 'don_gia_nhap', value: number) => {
    if (value <= 0 && field === 'so_luong_nhap') { removeFromCart(ma_sp); return; }
    setCart(cart.map((item) =>
      item.ma_sp === ma_sp
        ? { ...item, [field]: value, thanh_tien: (field === 'so_luong_nhap' ? value : item.so_luong_nhap) * (field === 'don_gia_nhap' ? value : item.don_gia_nhap) }
        : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.thanh_tien, 0);
  const remainingAmount = totalAmount - amountPaid;

  const handleCreatePurchase = async () => {
    if (cart.length === 0) { toast.error("Chưa có sản phẩm nào"); return; }
    if (!selectedSupplier) { toast.error("Vui lòng chọn nhà cung cấp"); return; }
    if (!selectedBranch) { toast.error("Vui lòng chọn chi nhánh"); return; }
    if (!selectedEmployee) { toast.error("Vui lòng chọn nhân viên"); return; }

    try {
      const maPhieuNhap = `PN${Date.now()}`;
      await purchaseService.create({
        ma_phieu_nhap: maPhieuNhap,
        ma_cn: selectedBranch,
        ma_ncc: selectedSupplier,
        ma_nv_kho: selectedEmployee,
        ngay_gio_nhap: new Date().toISOString(),
        tong_gia_tri: totalAmount,
        so_tien_da_thanh_toan: amountPaid,
        trang_thai_thanh_toan: amountPaid >= totalAmount ? "đã thanh toán" : "còn nợ",
        ghi_chu: note,
        items: cart.map((item) => ({
          ma_sp: item.ma_sp,
          so_luong_nhap: item.so_luong_nhap,
          don_gia_nhap: item.don_gia_nhap,
        })),
      });
      toast.success(`Tạo phiếu nhập thành công! Mã: ${maPhieuNhap}`);
      resetForm();
      setDialogOpen(false);
      fetchPurchases();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi tạo phiếu nhập");
    }
  };

  const resetForm = () => {
    setCart([]);
    setSelectedSupplier("");
    setSelectedBranch("");
    setSelectedEmployee("");
    setAmountPaid(0);
    setNote("");
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  const formatDate = (dateStr: string) => { try { return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: vi }); } catch { return dateStr; } };
  const getPaymentBadge = (status: string | null) => {
    if (status === "đã thanh toán") return <Badge variant="default">Đã thanh toán</Badge>;
    return <Badge variant="destructive">Còn nợ</Badge>;
  };

  const columns = [
    { header: "Mã phiếu", accessor: "ma_phieu_nhap" as keyof any },
    { header: "NCC", accessor: ((row: any) => row.nha_cung_cap?.ten_cong_ty || row.ma_ncc) as any },
    { header: "Chi nhánh", accessor: ((row: any) => row.chi_nhanh?.ten_cn || row.ma_cn) as any },
    { header: "Ngày nhập", accessor: ((row: any) => formatDate(row.ngay_gio_nhap)) as any },
    { header: "Tổng giá trị", accessor: ((row: any) => formatCurrency(row.tong_gia_tri || 0)) as any },
    { header: "Trạng thái", accessor: ((row: any) => getPaymentBadge(row.trang_thai_thanh_toan)) as any },
  ];

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileInput className="w-8 h-8 text-primary" />
              Quản lý nhập hàng
            </h1>
            <p className="text-muted-foreground mt-1">Tạo và quản lý phiếu nhập hàng từ nhà cung cấp</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" />Tạo phiếu nhập</Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo phiếu nhập hàng mới</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Chọn sản phẩm</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.ma_sp} value={p.ma_sp}>{p.ten_sp}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-20"
                          min="1"
                          placeholder="SL"
                        />
                        <Input
                          type="number"
                          value={unitPrice}
                          onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                          className="w-32"
                          min="0"
                          placeholder="Đơn giá"
                        />
                        <Button onClick={addToCart} className="gap-2"><Plus className="w-4 h-4" />Thêm</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">Danh sách sản phẩm ({cart.length})</CardTitle></CardHeader>
                    <CardContent>
                      {cart.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">Chưa có sản phẩm nào</p>
                      ) : (
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <div key={item.ma_sp} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                              <div className="flex-1">
                                <p className="font-medium">{item.ten_sp}</p>
                                <p className="text-sm text-muted-foreground">{item.ma_sp}</p>
                              </div>
                              <Input
                                type="number"
                                value={item.so_luong_nhap}
                                onChange={(e) => updateCartItem(item.ma_sp, 'so_luong_nhap', parseInt(e.target.value) || 0)}
                                className="w-20"
                                min="0"
                              />
                              <Input
                                type="number"
                                value={item.don_gia_nhap}
                                onChange={(e) => updateCartItem(item.ma_sp, 'don_gia_nhap', parseFloat(e.target.value) || 0)}
                                className="w-28"
                                min="0"
                              />
                              <div className="w-32 text-right font-semibold">{formatCurrency(item.thanh_tien)}</div>
                              <Button size="sm" variant="outline" onClick={() => removeFromCart(item.ma_sp)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="sticky top-0">
                    <CardHeader><CardTitle className="text-base">Thông tin phiếu nhập</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nhà cung cấp *</Label>
                        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                          <SelectTrigger><SelectValue placeholder="Chọn NCC" /></SelectTrigger>
                          <SelectContent>
                            {suppliers.map((s) => (
                              <SelectItem key={s.ma_ncc} value={s.ma_ncc}>{s.ten_cong_ty}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Chi nhánh *</Label>
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                          <SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger>
                          <SelectContent>
                            {branches.map((b) => (
                              <SelectItem key={b.ma_cn} value={b.ma_cn}>{b.ten_cn}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Nhân viên kho *</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                          <SelectTrigger><SelectValue placeholder="Chọn NV" /></SelectTrigger>
                          <SelectContent>
                            {employees.map((e) => (
                              <SelectItem key={e.ma_nv} value={e.ma_nv}>{e.ho_ten}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ghi chú</Label>
                        <Textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={2}
                          placeholder="Ghi chú thêm..."
                        />
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex justify-between text-lg">
                          <span>Tổng tiền:</span>
                          <span className="font-bold text-primary">{formatCurrency(totalAmount)}</span>
                        </div>
                        <div className="space-y-2">
                          <Label>Số tiền đã trả</Label>
                          <Input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="flex justify-between text-lg">
                          <span>Còn nợ:</span>
                          <span className="font-bold text-destructive">{formatCurrency(Math.max(0, remainingAmount))}</span>
                        </div>
                      </div>
                      <Button onClick={handleCreatePurchase} className="w-full gap-2" size="lg" disabled={cart.length === 0}>
                        <Package className="w-5 h-5" />
                        Tạo phiếu nhập
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng phiếu nhập</CardTitle>
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{purchases.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {purchases.filter(p => p.trang_thai_thanh_toan === "đã thanh toán").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Còn nợ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {purchases.filter(p => p.trang_thai_thanh_toan === "còn nợ").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <DataTable data={purchases} columns={columns} loading={loading} emptyMessage="Chưa có phiếu nhập nào" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Purchases;