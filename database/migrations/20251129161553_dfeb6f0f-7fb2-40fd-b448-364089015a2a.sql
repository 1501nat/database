-- ============================================
-- HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN LẺ
-- ============================================

-- 1. CHI NHÁNH
CREATE TABLE chi_nhanh (
    ma_cn TEXT PRIMARY KEY,
    ten_cn TEXT NOT NULL,
    so_nha_duong TEXT,
    phuong_xa TEXT,
    quan_huyen TEXT,
    tinh_thanh TEXT,
    dia_chi TEXT,
    sdt TEXT,
    ngay_mo_cua DATE,
    trang_thai_hoat_dong TEXT DEFAULT 'đang hoạt động',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NHÂN VIÊN
CREATE TABLE nhan_vien (
    ma_nv TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    sdt TEXT,
    ngay_sinh DATE,
    gioi_tinh TEXT,
    cccd TEXT,
    email TEXT,
    dia_chi_thuong_tru TEXT,
    ngay_vao_lam DATE,
    trang_thai_lam_viec TEXT DEFAULT 'đang làm',
    ma_cn TEXT NOT NULL REFERENCES chi_nhanh(ma_cn),
    ma_giam_sat TEXT REFERENCES nhan_vien(ma_nv),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHẤM CÔNG NHÂN VIÊN
CREATE TABLE cham_cong (
    ma_nv TEXT NOT NULL REFERENCES nhan_vien(ma_nv) ON DELETE CASCADE,
    ngay_lam_viec DATE NOT NULL,
    gio_vao TIME,
    gio_ra TIME,
    loai_ca TEXT,
    ghi_chu TEXT,
    PRIMARY KEY (ma_nv, ngay_lam_viec),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DANH MỤC SẢN PHẨM
CREATE TABLE danh_muc_san_pham (
    ma_dm TEXT PRIMARY KEY,
    ten_danh_muc TEXT NOT NULL,
    mo_ta TEXT,
    ma_dm_super TEXT REFERENCES danh_muc_san_pham(ma_dm),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SẢN PHẨM
CREATE TABLE san_pham (
    ma_sp TEXT PRIMARY KEY,
    ten_sp TEXT NOT NULL,
    mo_ta TEXT,
    don_vi_tinh TEXT,
    trang_thai_sp TEXT DEFAULT 'đang KD',
    gia_cap_nhat_gan_nhat DECIMAL(18,2),
    ngay_them_vao DATE,
    ma_vach TEXT,
    gia_ban_le DECIMAL(18,2),
    ma_dm TEXT NOT NULL REFERENCES danh_muc_san_pham(ma_dm),
    ma_phieu_nhap_cuoi TEXT,
    stt_dong_nhap_cuoi INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. THUỘC TÍNH SẢN PHẨM
CREATE TABLE thuoc_tinh_san_pham (
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp) ON DELETE CASCADE,
    thuoc_tinh_sp TEXT NOT NULL,
    PRIMARY KEY (ma_sp, thuoc_tinh_sp),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HÌNH ẢNH SẢN PHẨM
CREATE TABLE hinh_anh_san_pham (
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp) ON DELETE CASCADE,
    duong_dan_hinh_anh TEXT NOT NULL,
    PRIMARY KEY (ma_sp, duong_dan_hinh_anh),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TỒN KHO THEO CHI NHÁNH
CREATE TABLE ton_kho (
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp),
    ma_cn TEXT NOT NULL REFERENCES chi_nhanh(ma_cn),
    so_luong_ton INTEGER DEFAULT 0 CHECK (so_luong_ton >= 0),
    so_luong_toi_da INTEGER,
    so_luong_toi_thieu INTEGER,
    ngay_cap_nhat DATE,
    PRIMARY KEY (ma_sp, ma_cn),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NHÀ CUNG CẤP
CREATE TABLE nha_cung_cap (
    ma_ncc TEXT PRIMARY KEY,
    ten_cong_ty TEXT NOT NULL,
    trang_thai_hop_tac TEXT DEFAULT 'đang hợp tác',
    sdt TEXT,
    email TEXT,
    dia_chi TEXT,
    nguoi_lien_he TEXT,
    ma_so_thue TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QUAN HỆ SẢN PHẨM - NHÀ CUNG CẤP
CREATE TABLE san_pham_nha_cung_cap (
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp),
    ma_ncc TEXT NOT NULL REFERENCES nha_cung_cap(ma_ncc),
    gia_nhap_gan_nhat DECIMAL(18,2),
    ngay_cap_nhat_gia DATE,
    PRIMARY KEY (ma_sp, ma_ncc),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PHIẾU NHẬP HÀNG
CREATE TABLE phieu_nhap (
    ma_phieu_nhap TEXT PRIMARY KEY,
    ngay_gio_nhap TIMESTAMPTZ NOT NULL,
    so_tien_da_thanh_toan DECIMAL(18,2) DEFAULT 0,
    tong_gia_tri DECIMAL(18,2) NOT NULL,
    ghi_chu TEXT,
    trang_thai_thanh_toan TEXT DEFAULT 'còn nợ',
    ma_ncc TEXT NOT NULL REFERENCES nha_cung_cap(ma_ncc),
    ma_nv_kho TEXT NOT NULL REFERENCES nhan_vien(ma_nv),
    ma_cn TEXT NOT NULL REFERENCES chi_nhanh(ma_cn),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CHI TIẾT PHIẾU NHẬP
CREATE TABLE chi_tiet_phieu_nhap (
    ma_phieu_nhap TEXT NOT NULL REFERENCES phieu_nhap(ma_phieu_nhap) ON DELETE CASCADE,
    stt_dong INTEGER NOT NULL,
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp),
    so_luong_nhap INTEGER NOT NULL CHECK (so_luong_nhap > 0),
    don_gia_nhap DECIMAL(18,2) NOT NULL CHECK (don_gia_nhap >= 0),
    PRIMARY KEY (ma_phieu_nhap, stt_dong),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. KHÁCH HÀNG
CREATE TABLE khach_hang (
    ma_kh TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    gioi_tinh TEXT,
    ngay_sinh DATE,
    dia_chi TEXT,
    sdt TEXT NOT NULL,
    email TEXT,
    ngay_dang_ky DATE,
    hang_thanh_vien TEXT DEFAULT 'thường',
    diem_tich_luy INTEGER DEFAULT 0 CHECK (diem_tich_luy >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. HÓA ĐƠN BÁN HÀNG
CREATE TABLE hoa_don_ban_hang (
    ma_hdbh TEXT PRIMARY KEY,
    trang_thai_hoa_don TEXT DEFAULT 'hoàn thành',
    tong_gia_tri_truoc_giam DECIMAL(18,2) NOT NULL,
    so_tien_giam_gia DECIMAL(18,2) DEFAULT 0,
    tong_tien_thanh_toan DECIMAL(18,2) NOT NULL,
    so_tien_khach_dua DECIMAL(18,2) NOT NULL,
    so_tien_thoi_lai DECIMAL(18,2) DEFAULT 0,
    hinh_thuc_thanh_toan TEXT,
    ngay_gio_giao_dich TIMESTAMPTZ NOT NULL,
    ghi_chu TEXT,
    ma_nv_bh TEXT NOT NULL REFERENCES nhan_vien(ma_nv),
    ma_cn TEXT NOT NULL REFERENCES chi_nhanh(ma_cn),
    ma_kh TEXT REFERENCES khach_hang(ma_kh),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CHI TIẾT HÓA ĐƠN BÁN HÀNG
CREATE TABLE chi_tiet_hdbh (
    ma_hdbh TEXT NOT NULL REFERENCES hoa_don_ban_hang(ma_hdbh) ON DELETE CASCADE,
    stt_dong INTEGER NOT NULL,
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp),
    so_luong_ban INTEGER NOT NULL CHECK (so_luong_ban > 0),
    don_gia_ban DECIMAL(18,2) NOT NULL CHECK (don_gia_ban >= 0),
    PRIMARY KEY (ma_hdbh, stt_dong),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CHƯƠNG TRÌNH KHUYẾN MÃI
CREATE TABLE chuong_trinh_khuyen_mai (
    ma_ctkm TEXT PRIMARY KEY,
    ten_chuong_trinh TEXT NOT NULL,
    mo_ta TEXT,
    loai_khuyen_mai TEXT,
    gia_tri_khuyen_mai DECIMAL(18,2),
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai_ct TEXT DEFAULT 'chưa bắt đầu',
    CHECK (ngay_ket_thuc >= ngay_bat_dau),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. LIÊN KẾT CHƯƠNG TRÌNH KHUYẾN MÃI - SẢN PHẨM
CREATE TABLE ctkm_san_pham (
    ma_ctkm TEXT NOT NULL REFERENCES chuong_trinh_khuyen_mai(ma_ctkm) ON DELETE CASCADE,
    ma_sp TEXT NOT NULL REFERENCES san_pham(ma_sp) ON DELETE CASCADE,
    PRIMARY KEY (ma_ctkm, ma_sp),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chi_nhanh ENABLE ROW LEVEL SECURITY;
ALTER TABLE nhan_vien ENABLE ROW LEVEL SECURITY;
ALTER TABLE cham_cong ENABLE ROW LEVEL SECURITY;
ALTER TABLE danh_muc_san_pham ENABLE ROW LEVEL SECURITY;
ALTER TABLE san_pham ENABLE ROW LEVEL SECURITY;
ALTER TABLE thuoc_tinh_san_pham ENABLE ROW LEVEL SECURITY;
ALTER TABLE hinh_anh_san_pham ENABLE ROW LEVEL SECURITY;
ALTER TABLE ton_kho ENABLE ROW LEVEL SECURITY;
ALTER TABLE nha_cung_cap ENABLE ROW LEVEL SECURITY;
ALTER TABLE san_pham_nha_cung_cap ENABLE ROW LEVEL SECURITY;
ALTER TABLE phieu_nhap ENABLE ROW LEVEL SECURITY;
ALTER TABLE chi_tiet_phieu_nhap ENABLE ROW LEVEL SECURITY;
ALTER TABLE khach_hang ENABLE ROW LEVEL SECURITY;
ALTER TABLE hoa_don_ban_hang ENABLE ROW LEVEL SECURITY;
ALTER TABLE chi_tiet_hdbh ENABLE ROW LEVEL SECURITY;
ALTER TABLE chuong_trinh_khuyen_mai ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctkm_san_pham ENABLE ROW LEVEL SECURITY;

-- Create user roles table
CREATE TYPE app_role AS ENUM ('admin', 'quan_ly', 'ban_hang', 'kho', 'ke_toan');

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    ma_nv TEXT REFERENCES nhan_vien(ma_nv),
    UNIQUE (user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies - Authenticated users can read all data
CREATE POLICY "Authenticated users can view chi_nhanh" ON chi_nhanh FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view nhan_vien" ON nhan_vien FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view cham_cong" ON cham_cong FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view danh_muc_san_pham" ON danh_muc_san_pham FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view san_pham" ON san_pham FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view thuoc_tinh_san_pham" ON thuoc_tinh_san_pham FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view hinh_anh_san_pham" ON hinh_anh_san_pham FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view ton_kho" ON ton_kho FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view nha_cung_cap" ON nha_cung_cap FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view san_pham_nha_cung_cap" ON san_pham_nha_cung_cap FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view phieu_nhap" ON phieu_nhap FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view chi_tiet_phieu_nhap" ON chi_tiet_phieu_nhap FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view khach_hang" ON khach_hang FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view hoa_don_ban_hang" ON hoa_don_ban_hang FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view chi_tiet_hdbh" ON chi_tiet_hdbh FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view chuong_trinh_khuyen_mai" ON chuong_trinh_khuyen_mai FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view ctkm_san_pham" ON ctkm_san_pham FOR SELECT TO authenticated USING (true);

-- Admin and Quan Ly can manage all data
CREATE POLICY "Admins can manage chi_nhanh" ON chi_nhanh FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));
CREATE POLICY "Admins can manage nhan_vien" ON nhan_vien FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));
CREATE POLICY "Admins can manage danh_muc_san_pham" ON danh_muc_san_pham FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));
CREATE POLICY "Admins can manage san_pham" ON san_pham FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));
CREATE POLICY "Admins can manage nha_cung_cap" ON nha_cung_cap FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));
CREATE POLICY "Admins can manage khach_hang" ON khach_hang FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));
CREATE POLICY "Admins can manage chuong_trinh_khuyen_mai" ON chuong_trinh_khuyen_mai FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

-- Kho staff can manage inventory
CREATE POLICY "Kho staff can manage phieu_nhap" ON phieu_nhap FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly') OR has_role(auth.uid(), 'kho'));
CREATE POLICY "Kho staff can manage chi_tiet_phieu_nhap" ON chi_tiet_phieu_nhap FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly') OR has_role(auth.uid(), 'kho'));
CREATE POLICY "Kho staff can manage ton_kho" ON ton_kho FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly') OR has_role(auth.uid(), 'kho'));

-- Ban hang staff can manage sales
CREATE POLICY "Ban hang staff can manage hoa_don_ban_hang" ON hoa_don_ban_hang FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly') OR has_role(auth.uid(), 'ban_hang'));
CREATE POLICY "Ban hang staff can manage chi_tiet_hdbh" ON chi_tiet_hdbh FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly') OR has_role(auth.uid(), 'ban_hang'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage user roles" ON user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));