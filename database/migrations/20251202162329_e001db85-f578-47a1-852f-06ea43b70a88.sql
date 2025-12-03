-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage chi_nhanh" ON chi_nhanh;
DROP POLICY IF EXISTS "Authenticated users can view chi_nhanh" ON chi_nhanh;

-- Create permissive policies instead
CREATE POLICY "Authenticated users can view chi_nhanh"
ON chi_nhanh
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert chi_nhanh"
ON chi_nhanh
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can update chi_nhanh"
ON chi_nhanh
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));

CREATE POLICY "Admins can delete chi_nhanh"
ON chi_nhanh
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'quan_ly'));