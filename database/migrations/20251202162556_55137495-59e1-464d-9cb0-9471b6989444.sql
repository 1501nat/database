-- Fix nhan_vien RLS policies
DROP POLICY IF EXISTS "Admins can manage nhan_vien" ON nhan_vien;
DROP POLICY IF EXISTS "Authenticated users can view nhan_vien" ON nhan_vien;

CREATE POLICY "Authenticated users can view nhan_vien"
ON nhan_vien FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert nhan_vien"
ON nhan_vien FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update nhan_vien"
ON nhan_vien FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete nhan_vien"
ON nhan_vien FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

-- Fix san_pham RLS policies
DROP POLICY IF EXISTS "Admins can manage san_pham" ON san_pham;
DROP POLICY IF EXISTS "Authenticated users can view san_pham" ON san_pham;

CREATE POLICY "Authenticated users can view san_pham"
ON san_pham FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert san_pham"
ON san_pham FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update san_pham"
ON san_pham FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete san_pham"
ON san_pham FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

-- Fix khach_hang RLS policies
DROP POLICY IF EXISTS "Admins can manage khach_hang" ON khach_hang;
DROP POLICY IF EXISTS "Authenticated users can view khach_hang" ON khach_hang;

CREATE POLICY "Authenticated users can view khach_hang"
ON khach_hang FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert khach_hang"
ON khach_hang FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update khach_hang"
ON khach_hang FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete khach_hang"
ON khach_hang FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

-- Fix danh_muc_san_pham RLS policies
DROP POLICY IF EXISTS "Admins can manage danh_muc_san_pham" ON danh_muc_san_pham;
DROP POLICY IF EXISTS "Authenticated users can view danh_muc_san_pham" ON danh_muc_san_pham;

CREATE POLICY "Authenticated users can view danh_muc_san_pham"
ON danh_muc_san_pham FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert danh_muc_san_pham"
ON danh_muc_san_pham FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update danh_muc_san_pham"
ON danh_muc_san_pham FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete danh_muc_san_pham"
ON danh_muc_san_pham FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

-- Fix nha_cung_cap RLS policies
DROP POLICY IF EXISTS "Admins can manage nha_cung_cap" ON nha_cung_cap;
DROP POLICY IF EXISTS "Authenticated users can view nha_cung_cap" ON nha_cung_cap;

CREATE POLICY "Authenticated users can view nha_cung_cap"
ON nha_cung_cap FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert nha_cung_cap"
ON nha_cung_cap FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update nha_cung_cap"
ON nha_cung_cap FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete nha_cung_cap"
ON nha_cung_cap FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

-- Fix chuong_trinh_khuyen_mai RLS policies
DROP POLICY IF EXISTS "Admins can manage chuong_trinh_khuyen_mai" ON chuong_trinh_khuyen_mai;
DROP POLICY IF EXISTS "Authenticated users can view chuong_trinh_khuyen_mai" ON chuong_trinh_khuyen_mai;

CREATE POLICY "Authenticated users can view chuong_trinh_khuyen_mai"
ON chuong_trinh_khuyen_mai FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert chuong_trinh_khuyen_mai"
ON chuong_trinh_khuyen_mai FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update chuong_trinh_khuyen_mai"
ON chuong_trinh_khuyen_mai FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete chuong_trinh_khuyen_mai"
ON chuong_trinh_khuyen_mai FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));