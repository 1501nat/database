-- MySQL Database Schema for Retail Management System
-- Run this script to create the necessary tables

CREATE DATABASE IF NOT EXISTS retail_management;
USE retail_management;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role ENUM('admin', 'quan_ly', 'ban_hang', 'kho', 'ke_toan') NOT NULL DEFAULT 'ban_hang',
    ma_nv VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chi nhánh (Branches)
CREATE TABLE IF NOT EXISTS chi_nhanh (
    ma_cn VARCHAR(50) PRIMARY KEY,
    ten_cn VARCHAR(255) NOT NULL,
    dia_chi TEXT,
    so_nha_duong VARCHAR(255),
    phuong_xa VARCHAR(255),
    quan_huyen VARCHAR(255),
    tinh_thanh VARCHAR(255),
    sdt VARCHAR(20),
    ngay_mo_cua DATE,
    trang_thai_hoat_dong VARCHAR(50) DEFAULT 'đang hoạt động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nhân viên (Employees)
CREATE TABLE IF NOT EXISTS nhan_vien (
    ma_nv VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    sdt VARCHAR(20),
    email VARCHAR(255),
    gioi_tinh VARCHAR(10),
    ngay_sinh DATE,
    cccd VARCHAR(20),
    dia_chi_thuong_tru TEXT,
    ngay_vao_lam DATE,
    ma_cn VARCHAR(50) NOT NULL,
    ma_giam_sat VARCHAR(50),
    trang_thai_lam_viec VARCHAR(50) DEFAULT 'đang làm',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn),
    FOREIGN KEY (ma_giam_sat) REFERENCES nhan_vien(ma_nv)
);

-- Danh mục sản phẩm (Categories)
CREATE TABLE IF NOT EXISTS danh_muc_san_pham (
    ma_dm VARCHAR(50) PRIMARY KEY,
    ten_danh_muc VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    ma_dm_super VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_dm_super) REFERENCES danh_muc_san_pham(ma_dm)
);

-- Sản phẩm (Products)
CREATE TABLE IF NOT EXISTS san_pham (
    ma_sp VARCHAR(50) PRIMARY KEY,
    ten_sp VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    don_vi_tinh VARCHAR(50),
    gia_ban_le DECIMAL(15,2),
    ma_dm VARCHAR(50) NOT NULL,
    ma_vach VARCHAR(100),
    trang_thai_sp VARCHAR(50) DEFAULT 'đang KD',
    ngay_them_vao DATE,
    gia_cap_nhat_gan_nhat DECIMAL(15,2),
    ma_phieu_nhap_cuoi VARCHAR(50),
    stt_dong_nhap_cuoi INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_dm) REFERENCES danh_muc_san_pham(ma_dm)
);

-- Khách hàng (Customers)
CREATE TABLE IF NOT EXISTS khach_hang (
    ma_kh VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    sdt VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    dia_chi TEXT,
    gioi_tinh VARCHAR(10),
    ngay_sinh DATE,
    hang_thanh_vien VARCHAR(50) DEFAULT 'thường',
    diem_tich_luy INT DEFAULT 0,
    ngay_dang_ky DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nhà cung cấp (Suppliers)
CREATE TABLE IF NOT EXISTS nha_cung_cap (
    ma_ncc VARCHAR(50) PRIMARY KEY,
    ten_cong_ty VARCHAR(255) NOT NULL,
    dia_chi TEXT,
    sdt VARCHAR(20),
    email VARCHAR(255),
    nguoi_lien_he VARCHAR(255),
    ma_so_thue VARCHAR(50),
    trang_thai_hop_tac VARCHAR(50) DEFAULT 'đang hợp tác',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tồn kho (Inventory)
CREATE TABLE IF NOT EXISTS ton_kho (
    ma_cn VARCHAR(50) NOT NULL,
    ma_sp VARCHAR(50) NOT NULL,
    so_luong_ton INT DEFAULT 0,
    so_luong_toi_thieu INT,
    so_luong_toi_da INT,
    ngay_cap_nhat DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_cn, ma_sp),
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp)
);

-- Hóa đơn bán hàng (Sales Invoices)
CREATE TABLE IF NOT EXISTS hoa_don_ban_hang (
    ma_hdbh VARCHAR(50) PRIMARY KEY,
    ma_cn VARCHAR(50) NOT NULL,
    ma_nv_bh VARCHAR(50) NOT NULL,
    ma_kh VARCHAR(50),
    ngay_gio_giao_dich TIMESTAMP NOT NULL,
    tong_gia_tri_truoc_giam DECIMAL(15,2) NOT NULL,
    so_tien_giam_gia DECIMAL(15,2) DEFAULT 0,
    tong_tien_thanh_toan DECIMAL(15,2) NOT NULL,
    so_tien_khach_dua DECIMAL(15,2) NOT NULL,
    so_tien_thoi_lai DECIMAL(15,2) DEFAULT 0,
    hinh_thuc_thanh_toan VARCHAR(50),
    ghi_chu TEXT,
    trang_thai_hoa_don VARCHAR(50) DEFAULT 'hoàn thành',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn),
    FOREIGN KEY (ma_nv_bh) REFERENCES nhan_vien(ma_nv),
    FOREIGN KEY (ma_kh) REFERENCES khach_hang(ma_kh)
);

-- Chi tiết hóa đơn bán hàng (Sales Invoice Details)
CREATE TABLE IF NOT EXISTS chi_tiet_hdbh (
    ma_hdbh VARCHAR(50) NOT NULL,
    stt_dong INT NOT NULL,
    ma_sp VARCHAR(50) NOT NULL,
    so_luong_ban INT NOT NULL,
    don_gia_ban DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_hdbh, stt_dong),
    FOREIGN KEY (ma_hdbh) REFERENCES hoa_don_ban_hang(ma_hdbh),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp)
);

-- Phiếu nhập (Import Receipts)
CREATE TABLE IF NOT EXISTS phieu_nhap (
    ma_phieu_nhap VARCHAR(50) PRIMARY KEY,
    ma_cn VARCHAR(50) NOT NULL,
    ma_ncc VARCHAR(50) NOT NULL,
    ma_nv_kho VARCHAR(50) NOT NULL,
    ngay_gio_nhap TIMESTAMP NOT NULL,
    tong_gia_tri DECIMAL(15,2) NOT NULL,
    so_tien_da_thanh_toan DECIMAL(15,2) DEFAULT 0,
    trang_thai_thanh_toan VARCHAR(50) DEFAULT 'còn nợ',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cn) REFERENCES chi_nhanh(ma_cn),
    FOREIGN KEY (ma_ncc) REFERENCES nha_cung_cap(ma_ncc),
    FOREIGN KEY (ma_nv_kho) REFERENCES nhan_vien(ma_nv)
);

-- Chi tiết phiếu nhập (Import Receipt Details)
CREATE TABLE IF NOT EXISTS chi_tiet_phieu_nhap (
    ma_phieu_nhap VARCHAR(50) NOT NULL,
    stt_dong INT NOT NULL,
    ma_sp VARCHAR(50) NOT NULL,
    so_luong_nhap INT NOT NULL,
    don_gia_nhap DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_phieu_nhap, stt_dong),
    FOREIGN KEY (ma_phieu_nhap) REFERENCES phieu_nhap(ma_phieu_nhap),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp)
);

-- Chương trình khuyến mãi (Promotions)
CREATE TABLE IF NOT EXISTS chuong_trinh_khuyen_mai (
    ma_ctkm VARCHAR(50) PRIMARY KEY,
    ten_chuong_trinh VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    loai_khuyen_mai VARCHAR(50),
    gia_tri_khuyen_mai DECIMAL(15,2),
    trang_thai_ct VARCHAR(50) DEFAULT 'chưa bắt đầu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CTKM - Sản phẩm (Promotion Products)
CREATE TABLE IF NOT EXISTS ctkm_san_pham (
    ma_ctkm VARCHAR(50) NOT NULL,
    ma_sp VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_ctkm, ma_sp),
    FOREIGN KEY (ma_ctkm) REFERENCES chuong_trinh_khuyen_mai(ma_ctkm),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp)
);

-- Sản phẩm - Nhà cung cấp (Product Suppliers)
CREATE TABLE IF NOT EXISTS san_pham_nha_cung_cap (
    ma_sp VARCHAR(50) NOT NULL,
    ma_ncc VARCHAR(50) NOT NULL,
    gia_nhap_gan_nhat DECIMAL(15,2),
    ngay_cap_nhat_gia DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_sp, ma_ncc),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp),
    FOREIGN KEY (ma_ncc) REFERENCES nha_cung_cap(ma_ncc)
);

-- Chấm công (Attendance)
CREATE TABLE IF NOT EXISTS cham_cong (
    ma_nv VARCHAR(50) NOT NULL,
    ngay_lam_viec DATE NOT NULL,
    gio_vao TIME,
    gio_ra TIME,
    loai_ca VARCHAR(50),
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_nv, ngay_lam_viec),
    FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv)
);

-- Hình ảnh sản phẩm (Product Images)
CREATE TABLE IF NOT EXISTS hinh_anh_san_pham (
    ma_sp VARCHAR(50) NOT NULL,
    duong_dan_hinh_anh VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_sp, duong_dan_hinh_anh),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp)
);

-- Thuộc tính sản phẩm (Product Attributes)
CREATE TABLE IF NOT EXISTS thuoc_tinh_san_pham (
    ma_sp VARCHAR(50) NOT NULL,
    thuoc_tinh_sp VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ma_sp, thuoc_tinh_sp),
    FOREIGN KEY (ma_sp) REFERENCES san_pham(ma_sp)
);

-- Create indexes for better performance
CREATE INDEX idx_nhan_vien_ma_cn ON nhan_vien(ma_cn);
CREATE INDEX idx_san_pham_ma_dm ON san_pham(ma_dm);
CREATE INDEX idx_hoa_don_ngay ON hoa_don_ban_hang(ngay_gio_giao_dich);
CREATE INDEX idx_hoa_don_ma_cn ON hoa_don_ban_hang(ma_cn);
CREATE INDEX idx_ton_kho_ma_sp ON ton_kho(ma_sp);
