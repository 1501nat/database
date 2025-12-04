-- =====================================================
-- DATABASE: quanlycuahang
-- Hệ thống quản lý cửa hàng bán lẻ
-- =====================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS quanlycuahang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quanlycuahang;

-- =====================================================
-- BẢNG USERS VÀ PHÂN QUYỀN
-- =====================================================

-- Bảng users - Lưu thông tin đăng nhập
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng user_roles - Phân quyền người dùng
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role ENUM('admin', 'quan_ly', 'ban_hang', 'kho', 'ke_toan') NOT NULL DEFAULT 'ban_hang',
    ma_nv VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CHI NHÁNH
-- =====================================================

CREATE TABLE IF NOT EXISTS chi_nhanh (
    ma_cn VARCHAR(20) PRIMARY KEY,
    ten_cn VARCHAR(100) NOT NULL,
    so_nha_duong VARCHAR(255),
    phuong_xa VARCHAR(100),
    quan_huyen VARCHAR(100),
    tinh_thanh VARCHAR(100),
    dia_chi VARCHAR(500),
    sdt VARCHAR(20),
    ngay_mo_cua DATE,
    trang_thai_hoat_dong ENUM('đang hoạt động', 'tạm ngưng', 'đã đóng') DEFAULT 'đang hoạt động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG NHÂN VIÊN
-- =====================================================

CREATE TABLE IF NOT EXISTS nhan_vien (
    ma_nv VARCHAR(20) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    gioi_tinh ENUM('Nam', 'Nữ', 'Khác'),
    ngay_sinh DATE,
    cccd VARCHAR(20),
    sdt VARCHAR(20),
    email VARCHAR(255),
    dia_chi_thuong_tru VARCHAR(500),
    ngay_vao_lam DATE,
    trang_thai_lam_viec ENUM('đang làm', 'nghỉ phép', 'đã nghỉ') DEFAULT 'đang làm',
    ma_cn VARCHAR(20) NOT NULL,
    ma_giam_sat VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn) ON DELETE RESTRICT,
    FOREIGN KEY (ma_giam_sat) REFERENCES nhan_vien(ma_nv) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm foreign key cho user_roles sau khi tạo bảng nhan_vien
ALTER TABLE user_roles ADD FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv) ON DELETE SET NULL;

-- =====================================================
-- BẢNG DANH MỤC SẢN PHẨM
-- =====================================================

CREATE TABLE IF NOT EXISTS danh_muc_san_pham (
    ma_dm VARCHAR(20) PRIMARY KEY,
    ten_danh_muc VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    ma_dm_super VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_dm_super) REFERENCES danh_muc_san_pham(ma_dm) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG SẢN PHẨM
-- =====================================================

CREATE TABLE IF NOT EXISTS san_pham (
    ma_sp VARCHAR(20) PRIMARY KEY,
    ten_sp VARCHAR(200) NOT NULL,
    mo_ta TEXT,
    ma_vach VARCHAR(50),
    don_vi_tinh VARCHAR(50),
    gia_ban_le DECIMAL(15, 2),
    gia_cap_nhat_gan_nhat DECIMAL(15, 2),
    ngay_them_vao DATE,
    trang_thai_sp ENUM('đang KD', 'ngừng KD', 'hết hàng') DEFAULT 'đang KD',
    ma_dm VARCHAR(20) NOT NULL,
    ma_phieu_nhap_cuoi VARCHAR(20),
    stt_dong_nhap_cuoi INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_dm) REFERENCES danh_muc_san_pham(ma_dm) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG KHÁCH HÀNG
-- =====================================================

CREATE TABLE IF NOT EXISTS khach_hang (
    ma_kh VARCHAR(20) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    gioi_tinh ENUM('Nam', 'Nữ', 'Khác'),
    ngay_sinh DATE,
    sdt VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    dia_chi VARCHAR(500),
    ngay_dang_ky DATE,
    diem_tich_luy INT DEFAULT 0,
    hang_thanh_vien ENUM('thường', 'bạc', 'vàng', 'kim cương') DEFAULT 'thường',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG NHÀ CUNG CẤP
-- =====================================================

CREATE TABLE IF NOT EXISTS nha_cung_cap (
    ma_ncc VARCHAR(20) PRIMARY KEY,
    ten_cong_ty VARCHAR(200) NOT NULL,
    nguoi_lien_he VARCHAR(100),
    sdt VARCHAR(20),
    email VARCHAR(255),
    dia_chi VARCHAR(500),
    ma_so_thue VARCHAR(50),
    trang_thai_hop_tac ENUM('đang hợp tác', 'tạm ngưng', 'ngừng hợp tác') DEFAULT 'đang hợp tác',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG TỒN KHO
-- =====================================================

CREATE TABLE IF NOT EXISTS ton_kho (
    ma_cn VARCHAR(20) NOT NULL,
    ma_sp VARCHAR(20) NOT NULL,
    so_luong_ton INT DEFAULT 0,
    so_luong_toi_thieu INT,
    so_luong_toi_da INT,
    ngay_cap_nhat DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_cn, ma_sp),
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn) ON DELETE CASCADE,
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG HÓA ĐƠN BÁN HÀNG
-- =====================================================

CREATE TABLE IF NOT EXISTS hoa_don_ban_hang (
    ma_hdbh VARCHAR(20) PRIMARY KEY,
    ngay_gio_giao_dich DATETIME NOT NULL,
    ma_nv_bh VARCHAR(20) NOT NULL,
    ma_cn VARCHAR(20) NOT NULL,
    ma_kh VARCHAR(20),
    tong_gia_tri_truoc_giam DECIMAL(15, 2) NOT NULL,
    so_tien_giam_gia DECIMAL(15, 2) DEFAULT 0,
    tong_tien_thanh_toan DECIMAL(15, 2) NOT NULL,
    so_tien_khach_dua DECIMAL(15, 2) NOT NULL,
    so_tien_thoi_lai DECIMAL(15, 2) DEFAULT 0,
    hinh_thuc_thanh_toan ENUM('tiền mặt', 'chuyển khoản', 'thẻ', 'ví điện tử') DEFAULT 'tiền mặt',
    trang_thai_hoa_don ENUM('hoàn thành', 'đã hủy', 'chờ xử lý') DEFAULT 'hoàn thành',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nv_bh) REFERENCES nhan_vien(ma_nv) ON DELETE RESTRICT,
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn) ON DELETE RESTRICT,
    FOREIGN KEY (ma_kh) REFERENCES khach_hang(ma_kh) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CHI TIẾT HÓA ĐƠN BÁN HÀNG
-- =====================================================

CREATE TABLE IF NOT EXISTS chi_tiet_hdbh (
    ma_hdbh VARCHAR(20) NOT NULL,
    stt_dong INT NOT NULL,
    ma_sp VARCHAR(20) NOT NULL,
    so_luong_ban INT NOT NULL,
    don_gia_ban DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_hdbh, stt_dong),
    FOREIGN KEY (ma_hdbh) REFERENCES hoa_don_ban_hang(ma_hdbh) ON DELETE CASCADE,
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG PHIẾU NHẬP
-- =====================================================

CREATE TABLE IF NOT EXISTS phieu_nhap (
    ma_phieu_nhap VARCHAR(20) PRIMARY KEY,
    ngay_gio_nhap DATETIME NOT NULL,
    ma_ncc VARCHAR(20) NOT NULL,
    ma_nv_kho VARCHAR(20) NOT NULL,
    ma_cn VARCHAR(20) NOT NULL,
    tong_gia_tri DECIMAL(15, 2) NOT NULL,
    so_tien_da_thanh_toan DECIMAL(15, 2) DEFAULT 0,
    trang_thai_thanh_toan ENUM('đã thanh toán', 'còn nợ', 'chưa thanh toán') DEFAULT 'còn nợ',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_ncc) REFERENCES nha_cung_cap(ma_ncc) ON DELETE RESTRICT,
    FOREIGN KEY (ma_nv_kho) REFERENCES nhan_vien(ma_nv) ON DELETE RESTRICT,
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm foreign key cho san_pham sau khi tạo bảng phieu_nhap
ALTER TABLE san_pham ADD FOREIGN KEY (ma_phieu_nhap_cuoi) REFERENCES phieu_nhap(ma_phieu_nhap) ON DELETE SET NULL;

-- =====================================================
-- BẢNG CHI TIẾT PHIẾU NHẬP
-- =====================================================

CREATE TABLE IF NOT EXISTS chi_tiet_phieu_nhap (
    ma_phieu_nhap VARCHAR(20) NOT NULL,
    stt_dong INT NOT NULL,
    ma_sp VARCHAR(20) NOT NULL,
    so_luong_nhap INT NOT NULL,
    don_gia_nhap DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_phieu_nhap, stt_dong),
    FOREIGN KEY (ma_phieu_nhap) REFERENCES phieu_nhap(ma_phieu_nhap) ON DELETE CASCADE,
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CHƯƠNG TRÌNH KHUYẾN MÃI
-- =====================================================

CREATE TABLE IF NOT EXISTS chuong_trinh_khuyen_mai (
    ma_ctkm VARCHAR(20) PRIMARY KEY,
    ten_chuong_trinh VARCHAR(200) NOT NULL,
    mo_ta TEXT,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    loai_khuyen_mai ENUM('giảm giá %', 'giảm giá tiền', 'mua X tặng Y', 'combo') DEFAULT 'giảm giá %',
    gia_tri_khuyen_mai DECIMAL(15, 2),
    trang_thai_ct ENUM('chưa bắt đầu', 'đang diễn ra', 'đã kết thúc', 'tạm ngưng') DEFAULT 'chưa bắt đầu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG KHUYẾN MÃI - SẢN PHẨM
-- =====================================================

CREATE TABLE IF NOT EXISTS ctkm_san_pham (
    ma_ctkm VARCHAR(20) NOT NULL,
    ma_sp VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_ctkm, ma_sp),
    FOREIGN KEY (ma_ctkm) REFERENCES chuong_trinh_khuyen_mai(ma_ctkm) ON DELETE CASCADE,
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG SẢN PHẨM - NHÀ CUNG CẤP
-- =====================================================

CREATE TABLE IF NOT EXISTS san_pham_nha_cung_cap (
    ma_sp VARCHAR(20) NOT NULL,
    ma_ncc VARCHAR(20) NOT NULL,
    gia_nhap_gan_nhat DECIMAL(15, 2),
    ngay_cap_nhat_gia DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_sp, ma_ncc),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE CASCADE,
    FOREIGN KEY (ma_ncc) REFERENCES nha_cung_cap(ma_ncc) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG CHẤM CÔNG
-- =====================================================

CREATE TABLE IF NOT EXISTS cham_cong (
    ma_nv VARCHAR(20) NOT NULL,
    ngay_lam_viec DATE NOT NULL,
    gio_vao TIME,
    gio_ra TIME,
    loai_ca ENUM('sáng', 'chiều', 'tối', 'cả ngày') DEFAULT 'cả ngày',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_nv, ngay_lam_viec),
    FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG HÌNH ẢNH SẢN PHẨM
-- =====================================================

CREATE TABLE IF NOT EXISTS hinh_anh_san_pham (
    ma_sp VARCHAR(20) NOT NULL,
    duong_dan_hinh_anh VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_sp, duong_dan_hinh_anh),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BẢNG THUỘC TÍNH SẢN PHẨM
-- =====================================================

CREATE TABLE IF NOT EXISTS thuoc_tinh_san_pham (
    ma_sp VARCHAR(20) NOT NULL,
    thuoc_tinh_sp VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_sp, thuoc_tinh_sp),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TẠO INDEXES ĐỂ TỐI ƯU HIỆU NĂNG
-- =====================================================

CREATE INDEX idx_nhan_vien_ma_cn ON nhan_vien(ma_cn);
CREATE INDEX idx_san_pham_ma_dm ON san_pham(ma_dm);
CREATE INDEX idx_san_pham_trang_thai ON san_pham(trang_thai_sp);
CREATE INDEX idx_khach_hang_sdt ON khach_hang(sdt);
CREATE INDEX idx_hoa_don_ngay ON hoa_don_ban_hang(ngay_gio_giao_dich);
CREATE INDEX idx_hoa_don_ma_cn ON hoa_don_ban_hang(ma_cn);
CREATE INDEX idx_phieu_nhap_ngay ON phieu_nhap(ngay_gio_nhap);
CREATE INDEX idx_ton_kho_ma_sp ON ton_kho(ma_sp);
CREATE INDEX idx_ctkm_ngay ON chuong_trinh_khuyen_mai(ngay_bat_dau, ngay_ket_thuc);

-- =====================================================
-- DỮ LIỆU MẪU
-- =====================================================

-- Tạo chi nhánh mẫu
INSERT INTO chi_nhanh (ma_cn, ten_cn, so_nha_duong, phuong_xa, quan_huyen, tinh_thanh, dia_chi, sdt, ngay_mo_cua, trang_thai_hoat_dong)
VALUES 
('CN001', 'Chi nhánh Quận 1', '123 Nguyễn Huệ', 'Phường Bến Nghé', 'Quận 1', 'TP.HCM', '123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM', '0901234567', '2020-01-01', 'đang hoạt động'),
('CN002', 'Chi nhánh Quận 3', '456 Võ Văn Tần', 'Phường 5', 'Quận 3', 'TP.HCM', '456 Võ Văn Tần, P.5, Q.3, TP.HCM', '0901234568', '2021-06-15', 'đang hoạt động');

-- Tạo nhân viên mẫu
INSERT INTO nhan_vien (ma_nv, ho_ten, gioi_tinh, ngay_sinh, cccd, sdt, email, ngay_vao_lam, trang_thai_lam_viec, ma_cn)
VALUES 
('NV001', 'Nguyễn Văn Admin', 'Nam', '1990-05-15', '079123456789', '0912345678', 'admin@example.com', '2020-01-01', 'đang làm', 'CN001'),
('NV002', 'Trần Thị Quản Lý', 'Nữ', '1988-08-20', '079987654321', '0923456789', 'quanly@example.com', '2020-03-01', 'đang làm', 'CN001'),
('NV003', 'Lê Văn Bán Hàng', 'Nam', '1995-12-10', '079111222333', '0934567890', 'banhang@example.com', '2021-01-15', 'đang làm', 'CN001');

-- Tạo danh mục mẫu
INSERT INTO danh_muc_san_pham (ma_dm, ten_danh_muc, mo_ta)
VALUES 
('DM001', 'Điện tử', 'Các sản phẩm điện tử'),
('DM002', 'Thời trang', 'Quần áo, giày dép'),
('DM003', 'Thực phẩm', 'Đồ ăn, thức uống');

-- Tạo sản phẩm mẫu
INSERT INTO san_pham (ma_sp, ten_sp, mo_ta, don_vi_tinh, gia_ban_le, ngay_them_vao, trang_thai_sp, ma_dm)
VALUES 
('SP001', 'Điện thoại Samsung Galaxy A54', 'Điện thoại thông minh', 'Cái', 8990000, CURDATE(), 'đang KD', 'DM001'),
('SP002', 'Áo thun nam', 'Áo thun cotton 100%', 'Cái', 250000, CURDATE(), 'đang KD', 'DM002'),
('SP003', 'Nước suối 500ml', 'Nước khoáng thiên nhiên', 'Chai', 8000, CURDATE(), 'đang KD', 'DM003');

-- Tạo tồn kho mẫu
INSERT INTO ton_kho (ma_cn, ma_sp, so_luong_ton, so_luong_toi_thieu, so_luong_toi_da, ngay_cap_nhat)
VALUES 
('CN001', 'SP001', 50, 10, 200, CURDATE()),
('CN001', 'SP002', 100, 20, 500, CURDATE()),
('CN001', 'SP003', 500, 100, 2000, CURDATE()),
('CN002', 'SP001', 30, 5, 100, CURDATE());

-- =====================================================
-- HOÀN THÀNH
-- =====================================================
SELECT 'Database quanlycuahang đã được tạo thành công!' AS message;
