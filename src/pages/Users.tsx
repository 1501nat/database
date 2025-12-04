import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, UserCog, Shield, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import * as userService from "@/services/userService";
import * as employeeService from "@/services/employeeService";

const ROLES = [
  { value: 'admin', label: 'Admin', color: 'bg-red-500' },
  { value: 'quan_ly', label: 'Quản lý', color: 'bg-purple-500' },
  { value: 'ban_hang', label: 'Bán hàng', color: 'bg-blue-500' },
  { value: 'kho', label: 'Kho', color: 'bg-green-500' },
  { value: 'ke_toan', label: 'Kế toán', color: 'bg-orange-500' },
];

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<userService.User[]>([]);
  const [employees, setEmployees] = useState<employeeService.Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userService.User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'ban_hang',
    ma_nv: '',
  });

  // Lấy các role mà user hiện tại có thể tạo
  const getAllowedRoles = () => {
    if (currentUser?.role === 'admin') {
      return ROLES;
    }
    if (currentUser?.role === 'quan_ly') {
      return ROLES.filter(r => ['ban_hang', 'kho', 'ke_toan'].includes(r.value));
    }
    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, employeesData] = await Promise.all([
        userService.getUsers(),
        employeeService.getAll(),
      ]);
      setUsers(usersData);
      setEmployees(employeesData);
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (user?: userService.User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        password: '',
        role: user.role,
        ma_nv: user.ma_nv || '',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        password: '',
        role: 'ban_hang',
        ma_nv: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        // Cập nhật
        const updateData: userService.UpdateUserData = {
          role: formData.role,
          ma_nv: formData.ma_nv || undefined,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await userService.updateUser(selectedUser.id, updateData);
        toast.success('Cập nhật tài khoản thành công');
      } else {
        // Tạo mới
        await userService.createUser({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ma_nv: formData.ma_nv || undefined,
        });
        toast.success('Tạo tài khoản thành công');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await userService.deleteUser(selectedUser.id);
      toast.success('Xóa tài khoản thành công');
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleInfo = ROLES.find(r => r.value === role);
    return (
      <Badge className={`${roleInfo?.color || 'bg-gray-500'} text-white`}>
        {roleInfo?.label || role}
      </Badge>
    );
  };

  // Lọc nhân viên chưa có tài khoản
  const availableEmployees = employees.filter(
    emp => !users.some(u => u.ma_nv === emp.ma_nv)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <UserCog className="w-8 h-8" />
              Quản Lý Tài Khoản
            </h1>
            <p className="text-muted-foreground mt-1">
              Tạo và quản lý tài khoản cho nhân viên
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo Tài Khoản
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng tài khoản</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin & Quản lý</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => ['admin', 'quan_ly'].includes(u.role)).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nhân viên chưa có TK</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableEmployees.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Chưa có tài khoản nào
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.ma_nv || '-'}</TableCell>
                      <TableCell>{user.ho_ten || '-'}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                            disabled={
                              currentUser?.role !== 'admin' && 
                              ['admin', 'quan_ly'].includes(user.role)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={
                              user.id === currentUser?.id ||
                              (currentUser?.role !== 'admin' && ['admin', 'quan_ly'].includes(user.role))
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? 'Cập nhật thông tin tài khoản nhân viên'
                : 'Tạo tài khoản mới cho nhân viên'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!selectedUser}
                  required={!selectedUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {selectedUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!selectedUser}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllowedRoles().map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ma_nv">Nhân viên</Label>
                <Select
                  value={formData.ma_nv}
                  onValueChange={(value) => setFormData({ ...formData, ma_nv: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn</SelectItem>
                    {(selectedUser 
                      ? employees 
                      : availableEmployees
                    ).map((emp) => (
                      <SelectItem key={emp.ma_nv} value={emp.ma_nv}>
                        {emp.ma_nv} - {emp.ho_ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {selectedUser ? 'Cập nhật' : 'Tạo tài khoản'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa tài khoản "{selectedUser?.email}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UsersPage;
