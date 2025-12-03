# Retail Management Backend

Backend API cho hệ thống quản lý bán lẻ, xây dựng trên Node.js, Express và MySQL.

## Cài đặt

### 1. Yêu cầu
- Node.js 18+
- MySQL 8+

### 2. Cài đặt dependencies
```bash
cd backend
npm install
```

### 3. Cấu hình database
1. Tạo database MySQL:
```sql
CREATE DATABASE retail_management;
```

2. Chạy schema để tạo các bảng:
```bash
mysql -u root -p retail_management < src/database/schema.sql
```

### 4. Cấu hình môi trường
Tạo file `.env` từ template:
```bash
cp .env.example .env
```

Chỉnh sửa các giá trị trong `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=retail_management
JWT_SECRET=your_super_secret_key
PORT=3001
FRONTEND_URL=http://localhost:8080
```

### 5. Chạy server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/change-password` - Đổi mật khẩu

### Branches (Chi nhánh)
- `GET /api/branches` - Danh sách chi nhánh
- `GET /api/branches/:id` - Chi tiết chi nhánh
- `POST /api/branches` - Tạo chi nhánh
- `PUT /api/branches/:id` - Cập nhật chi nhánh
- `DELETE /api/branches/:id` - Xóa chi nhánh

### Employees (Nhân viên)
- `GET /api/employees` - Danh sách nhân viên
- `GET /api/employees/:id` - Chi tiết nhân viên
- `POST /api/employees` - Tạo nhân viên
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên

### Products (Sản phẩm)
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Customers (Khách hàng)
- `GET /api/customers` - Danh sách khách hàng
- `GET /api/customers/:id` - Chi tiết khách hàng
- `POST /api/customers` - Tạo khách hàng
- `PUT /api/customers/:id` - Cập nhật khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng

### Categories (Danh mục)
- `GET /api/categories` - Danh sách danh mục
- `GET /api/categories/:id` - Chi tiết danh mục
- `POST /api/categories` - Tạo danh mục
- `PUT /api/categories/:id` - Cập nhật danh mục
- `DELETE /api/categories/:id` - Xóa danh mục

### Inventory (Tồn kho)
- `GET /api/inventory` - Danh sách tồn kho
- `GET /api/inventory/:ma_cn/:ma_sp` - Chi tiết tồn kho
- `GET /api/inventory/branch/:ma_cn` - Tồn kho theo chi nhánh
- `GET /api/inventory/alerts/low-stock` - Cảnh báo hết hàng
- `POST /api/inventory` - Tạo tồn kho
- `PUT /api/inventory/:ma_cn/:ma_sp` - Cập nhật tồn kho
- `DELETE /api/inventory/:ma_cn/:ma_sp` - Xóa tồn kho

### Sales (Bán hàng)
- `GET /api/sales` - Danh sách hóa đơn
- `GET /api/sales/:id` - Chi tiết hóa đơn
- `GET /api/sales/:id/details` - Chi tiết sản phẩm trong hóa đơn
- `GET /api/sales/branch/:ma_cn` - Hóa đơn theo chi nhánh
- `GET /api/sales/report/date-range` - Báo cáo theo khoảng thời gian
- `POST /api/sales` - Tạo hóa đơn
- `PUT /api/sales/:id` - Cập nhật hóa đơn
- `DELETE /api/sales/:id` - Xóa hóa đơn

### Promotions (Khuyến mãi)
- `GET /api/promotions` - Danh sách CTKM
- `GET /api/promotions/active` - CTKM đang diễn ra
- `GET /api/promotions/:id` - Chi tiết CTKM
- `GET /api/promotions/:id/products` - Sản phẩm trong CTKM
- `POST /api/promotions` - Tạo CTKM
- `PUT /api/promotions/:id` - Cập nhật CTKM
- `DELETE /api/promotions/:id` - Xóa CTKM
- `POST /api/promotions/:id/products` - Thêm SP vào CTKM
- `DELETE /api/promotions/:id/products/:ma_sp` - Xóa SP khỏi CTKM

### Suppliers (Nhà cung cấp)
- `GET /api/suppliers` - Danh sách NCC
- `GET /api/suppliers/:id` - Chi tiết NCC
- `GET /api/suppliers/:id/products` - Sản phẩm của NCC
- `POST /api/suppliers` - Tạo NCC
- `PUT /api/suppliers/:id` - Cập nhật NCC
- `DELETE /api/suppliers/:id` - Xóa NCC

### Reports (Báo cáo)
- `GET /api/reports/dashboard` - Thống kê dashboard
- `GET /api/reports/sales/daily` - Doanh thu theo ngày
- `GET /api/reports/sales/monthly` - Doanh thu theo tháng
- `GET /api/reports/sales/by-branch` - Doanh thu theo chi nhánh
- `GET /api/reports/sales/by-employee` - Doanh thu theo nhân viên
- `GET /api/reports/products/top-selling` - Top sản phẩm bán chạy
- `GET /api/reports/products/low-stock` - Sản phẩm sắp hết hàng
- `GET /api/reports/customers/top` - Top khách hàng

## Roles (Phân quyền)

- `admin` - Toàn quyền
- `quan_ly` - Quản lý chi nhánh
- `ban_hang` - Nhân viên bán hàng
- `kho` - Nhân viên kho
- `ke_toan` - Kế toán

## Authentication

Tất cả API (trừ login/register) yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## Hosting

Có thể deploy backend này lên:
- **Render** (miễn phí)
- **Railway** (miễn phí)
- **DigitalOcean App Platform**
- **Heroku**
- **AWS EC2/ECS**
- **VPS riêng**

## Kết nối Frontend

Sau khi deploy backend, cập nhật frontend để sử dụng API URL mới. Xem hướng dẫn tạo API Service Layer cho frontend.
