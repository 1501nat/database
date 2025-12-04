/**
 * Sales Page - Trang bán hàng POS
 * @api-connections:
 *   - GET /api/products - Lấy danh sách sản phẩm
 *   - GET /api/customers - Lấy danh sách khách hàng  
 *   - GET /api/branches - Lấy danh sách chi nhánh
 *   - GET /api/employees - Lấy danh sách nhân viên
 *   - POST /api/sales - Tạo hóa đơn mới
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// API: Import services
import * as productService from "@/services/productService";
import * as customerService from "@/services/customerService";
import * as branchService from "@/services/branchService";
import * as employeeService from "@/services/employeeService";
import * as salesService from "@/services/salesService";
import { toast } from "sonner";
import { ShoppingCart, Plus, Trash2, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CartItem { ma_sp: string; ten_sp: string; don_gia: number; so_luong: number; thanh_tien: number; }

const Sales = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const [customerPaid, setCustomerPaid] = useState(0);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) fetchData(); }, [user]);

  // API: Gọi nhiều endpoints song song
  const fetchData = async () => {
    try {
      const [productsData, customersData, branchesData, employeesData] = await Promise.all([
        productService.getAll(),   // API: GET /api/products
        customerService.getAll(),  // API: GET /api/customers
        branchService.getAll(),    // API: GET /api/branches
        employeeService.getAll(),  // API: GET /api/employees
      ]);
      setProducts(productsData || []);
      setCustomers(customersData || []);
      setBranches(branchesData || []);
      setEmployees(employeesData || []);
    } catch (error: any) {
      toast.error(error.message || "Không thể tải dữ liệu");
    }
  };

  const addToCart = () => {
    if (!selectedProduct) { toast.error("Vui lòng chọn sản phẩm"); return; }
    const product = products.find((p) => p.ma_sp === selectedProduct);
    if (!product) return;
    const existingItem = cart.find((item) => item.ma_sp === selectedProduct);
    if (existingItem) {
      setCart(cart.map((item) => item.ma_sp === selectedProduct ? { ...item, so_luong: item.so_luong + quantity, thanh_tien: (item.so_luong + quantity) * item.don_gia } : item));
    } else {
      setCart([...cart, { ma_sp: product.ma_sp, ten_sp: product.ten_sp, don_gia: product.gia_ban_le || 0, so_luong: quantity, thanh_tien: (product.gia_ban_le || 0) * quantity }]);
    }
    setSelectedProduct(""); setQuantity(1);
    toast.success("Đã thêm vào giỏ hàng");
  };

  const removeFromCart = (ma_sp: string) => { setCart(cart.filter((item) => item.ma_sp !== ma_sp)); };
  const updateQuantity = (ma_sp: string, newQuantity: number) => {
    if (newQuantity <= 0) { removeFromCart(ma_sp); return; }
    setCart(cart.map((item) => item.ma_sp === ma_sp ? { ...item, so_luong: newQuantity, thanh_tien: newQuantity * item.don_gia } : item));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.thanh_tien, 0);
  const changeAmount = customerPaid - totalAmount;

  // API: POST /api/sales - Tạo hóa đơn
  const handleCheckout = async () => {
    if (cart.length === 0) { toast.error("Giỏ hàng trống"); return; }
    if (!selectedBranch || !selectedEmployee) { toast.error("Vui lòng chọn chi nhánh và nhân viên"); return; }
    if (customerPaid < totalAmount) { toast.error("Số tiền khách đưa không đủ"); return; }

    try {
      const maHDBH = `HD${Date.now()}`;
      await salesService.create({
        ma_hdbh: maHDBH,
        tong_gia_tri_truoc_giam: totalAmount,
        so_tien_giam_gia: 0,
        tong_tien_thanh_toan: totalAmount,
        so_tien_khach_dua: customerPaid,
        so_tien_thoi_lai: changeAmount,
        hinh_thuc_thanh_toan: paymentMethod,
        ngay_gio_giao_dich: new Date().toISOString(),
        ma_nv_bh: selectedEmployee,
        ma_cn: selectedBranch,
        ma_kh: selectedCustomer || null,
        trang_thai_hoa_don: "hoàn thành",
        items: cart.map((item, index) => ({ ma_sp: item.ma_sp, so_luong_ban: item.so_luong, don_gia_ban: item.don_gia })),
      });
      toast.success(`Thanh toán thành công! Mã hóa đơn: ${maHDBH}`);
      setCart([]); setCustomerPaid(0); setSelectedCustomer("");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi thanh toán");
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6"><h1 className="text-3xl font-bold flex items-center gap-2"><ShoppingCart className="w-8 h-8 text-primary" />Bán hàng (POS)</h1><p className="text-muted-foreground mt-1">Tạo hóa đơn bán hàng nhanh chóng</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-card mb-6"><CardHeader><CardTitle>Chọn sản phẩm</CardTitle></CardHeader><CardContent><div className="flex gap-4"><div className="flex-1"><Select value={selectedProduct} onValueChange={setSelectedProduct}><SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger><SelectContent>{products.map((p) => <SelectItem key={p.ma_sp} value={p.ma_sp}>{p.ten_sp} - {formatCurrency(p.gia_ban_le || 0)}</SelectItem>)}</SelectContent></Select></div><Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-24" min="1" /><Button onClick={addToCart} className="gap-2"><Plus className="w-4 h-4" />Thêm</Button></div></CardContent></Card>
            <Card className="shadow-card"><CardHeader><CardTitle>Giỏ hàng ({cart.length} sản phẩm)</CardTitle></CardHeader><CardContent>{cart.length === 0 ? <p className="text-muted-foreground text-center py-8">Giỏ hàng trống</p> : <div className="space-y-3">{cart.map((item) => (<div key={item.ma_sp} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"><div className="flex-1"><p className="font-medium">{item.ten_sp}</p><p className="text-sm text-muted-foreground">{formatCurrency(item.don_gia)}</p></div><Input type="number" value={item.so_luong} onChange={(e) => updateQuantity(item.ma_sp, parseInt(e.target.value) || 0)} className="w-20" min="0" /><div className="w-32 text-right font-semibold">{formatCurrency(item.thanh_tien)}</div><Button size="sm" variant="outline" onClick={() => removeFromCart(item.ma_sp)}><Trash2 className="w-4 h-4" /></Button></div>))}</div>}</CardContent></Card>
          </div>
          <div>
            <Card className="shadow-card sticky top-8"><CardHeader><CardTitle>Thanh toán</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="space-y-2"><Label>Chi nhánh *</Label><Select value={selectedBranch} onValueChange={setSelectedBranch}><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger><SelectContent>{branches.map((b) => <SelectItem key={b.ma_cn} value={b.ma_cn}>{b.ten_cn}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Nhân viên *</Label><Select value={selectedEmployee} onValueChange={setSelectedEmployee}><SelectTrigger><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger><SelectContent>{employees.map((e) => <SelectItem key={e.ma_nv} value={e.ma_nv}>{e.ho_ten}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Khách hàng</Label><Select value={selectedCustomer || "none"} onValueChange={(v) => setSelectedCustomer(v === "none" ? "" : v)}><SelectTrigger><SelectValue placeholder="Khách lẻ" /></SelectTrigger><SelectContent><SelectItem value="none">Khách lẻ</SelectItem>{customers.map((c) => <SelectItem key={c.ma_kh} value={c.ma_kh}>{c.ho_ten}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Hình thức thanh toán</Label><Select value={paymentMethod} onValueChange={setPaymentMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tiền mặt">Tiền mặt</SelectItem><SelectItem value="chuyển khoản">Chuyển khoản</SelectItem><SelectItem value="thẻ">Thẻ</SelectItem></SelectContent></Select></div>
              <Separator />
              <div className="space-y-3"><div className="flex justify-between text-lg"><span>Tổng tiền:</span><span className="font-bold text-primary">{formatCurrency(totalAmount)}</span></div><div className="space-y-2"><Label>Khách đưa</Label><Input type="number" value={customerPaid} onChange={(e) => setCustomerPaid(parseFloat(e.target.value) || 0)} placeholder="0" /></div><div className="flex justify-between text-lg"><span>Tiền thối:</span><span className="font-bold text-success">{formatCurrency(Math.max(0, changeAmount))}</span></div></div>
              <Button onClick={handleCheckout} className="w-full gap-2" size="lg" disabled={cart.length === 0}><DollarSign className="w-5 h-5" />Thanh toán</Button>
            </CardContent></Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sales;