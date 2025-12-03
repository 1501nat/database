export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cham_cong: {
        Row: {
          created_at: string | null
          ghi_chu: string | null
          gio_ra: string | null
          gio_vao: string | null
          loai_ca: string | null
          ma_nv: string
          ngay_lam_viec: string
        }
        Insert: {
          created_at?: string | null
          ghi_chu?: string | null
          gio_ra?: string | null
          gio_vao?: string | null
          loai_ca?: string | null
          ma_nv: string
          ngay_lam_viec: string
        }
        Update: {
          created_at?: string | null
          ghi_chu?: string | null
          gio_ra?: string | null
          gio_vao?: string | null
          loai_ca?: string | null
          ma_nv?: string
          ngay_lam_viec?: string
        }
        Relationships: [
          {
            foreignKeyName: "cham_cong_ma_nv_fkey"
            columns: ["ma_nv"]
            isOneToOne: false
            referencedRelation: "nhan_vien"
            referencedColumns: ["ma_nv"]
          },
        ]
      }
      chi_nhanh: {
        Row: {
          created_at: string | null
          dia_chi: string | null
          ma_cn: string
          ngay_mo_cua: string | null
          phuong_xa: string | null
          quan_huyen: string | null
          sdt: string | null
          so_nha_duong: string | null
          ten_cn: string
          tinh_thanh: string | null
          trang_thai_hoat_dong: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dia_chi?: string | null
          ma_cn: string
          ngay_mo_cua?: string | null
          phuong_xa?: string | null
          quan_huyen?: string | null
          sdt?: string | null
          so_nha_duong?: string | null
          ten_cn: string
          tinh_thanh?: string | null
          trang_thai_hoat_dong?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dia_chi?: string | null
          ma_cn?: string
          ngay_mo_cua?: string | null
          phuong_xa?: string | null
          quan_huyen?: string | null
          sdt?: string | null
          so_nha_duong?: string | null
          ten_cn?: string
          tinh_thanh?: string | null
          trang_thai_hoat_dong?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chi_tiet_hdbh: {
        Row: {
          created_at: string | null
          don_gia_ban: number
          ma_hdbh: string
          ma_sp: string
          so_luong_ban: number
          stt_dong: number
        }
        Insert: {
          created_at?: string | null
          don_gia_ban: number
          ma_hdbh: string
          ma_sp: string
          so_luong_ban: number
          stt_dong: number
        }
        Update: {
          created_at?: string | null
          don_gia_ban?: number
          ma_hdbh?: string
          ma_sp?: string
          so_luong_ban?: number
          stt_dong?: number
        }
        Relationships: [
          {
            foreignKeyName: "chi_tiet_hdbh_ma_hdbh_fkey"
            columns: ["ma_hdbh"]
            isOneToOne: false
            referencedRelation: "hoa_don_ban_hang"
            referencedColumns: ["ma_hdbh"]
          },
          {
            foreignKeyName: "chi_tiet_hdbh_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      chi_tiet_phieu_nhap: {
        Row: {
          created_at: string | null
          don_gia_nhap: number
          ma_phieu_nhap: string
          ma_sp: string
          so_luong_nhap: number
          stt_dong: number
        }
        Insert: {
          created_at?: string | null
          don_gia_nhap: number
          ma_phieu_nhap: string
          ma_sp: string
          so_luong_nhap: number
          stt_dong: number
        }
        Update: {
          created_at?: string | null
          don_gia_nhap?: number
          ma_phieu_nhap?: string
          ma_sp?: string
          so_luong_nhap?: number
          stt_dong?: number
        }
        Relationships: [
          {
            foreignKeyName: "chi_tiet_phieu_nhap_ma_phieu_nhap_fkey"
            columns: ["ma_phieu_nhap"]
            isOneToOne: false
            referencedRelation: "phieu_nhap"
            referencedColumns: ["ma_phieu_nhap"]
          },
          {
            foreignKeyName: "chi_tiet_phieu_nhap_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      chuong_trinh_khuyen_mai: {
        Row: {
          created_at: string | null
          gia_tri_khuyen_mai: number | null
          loai_khuyen_mai: string | null
          ma_ctkm: string
          mo_ta: string | null
          ngay_bat_dau: string
          ngay_ket_thuc: string
          ten_chuong_trinh: string
          trang_thai_ct: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gia_tri_khuyen_mai?: number | null
          loai_khuyen_mai?: string | null
          ma_ctkm: string
          mo_ta?: string | null
          ngay_bat_dau: string
          ngay_ket_thuc: string
          ten_chuong_trinh: string
          trang_thai_ct?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gia_tri_khuyen_mai?: number | null
          loai_khuyen_mai?: string | null
          ma_ctkm?: string
          mo_ta?: string | null
          ngay_bat_dau?: string
          ngay_ket_thuc?: string
          ten_chuong_trinh?: string
          trang_thai_ct?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ctkm_san_pham: {
        Row: {
          created_at: string | null
          ma_ctkm: string
          ma_sp: string
        }
        Insert: {
          created_at?: string | null
          ma_ctkm: string
          ma_sp: string
        }
        Update: {
          created_at?: string | null
          ma_ctkm?: string
          ma_sp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ctkm_san_pham_ma_ctkm_fkey"
            columns: ["ma_ctkm"]
            isOneToOne: false
            referencedRelation: "chuong_trinh_khuyen_mai"
            referencedColumns: ["ma_ctkm"]
          },
          {
            foreignKeyName: "ctkm_san_pham_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      danh_muc_san_pham: {
        Row: {
          created_at: string | null
          ma_dm: string
          ma_dm_super: string | null
          mo_ta: string | null
          ten_danh_muc: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ma_dm: string
          ma_dm_super?: string | null
          mo_ta?: string | null
          ten_danh_muc: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ma_dm?: string
          ma_dm_super?: string | null
          mo_ta?: string | null
          ten_danh_muc?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "danh_muc_san_pham_ma_dm_super_fkey"
            columns: ["ma_dm_super"]
            isOneToOne: false
            referencedRelation: "danh_muc_san_pham"
            referencedColumns: ["ma_dm"]
          },
        ]
      }
      hinh_anh_san_pham: {
        Row: {
          created_at: string | null
          duong_dan_hinh_anh: string
          ma_sp: string
        }
        Insert: {
          created_at?: string | null
          duong_dan_hinh_anh: string
          ma_sp: string
        }
        Update: {
          created_at?: string | null
          duong_dan_hinh_anh?: string
          ma_sp?: string
        }
        Relationships: [
          {
            foreignKeyName: "hinh_anh_san_pham_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      hoa_don_ban_hang: {
        Row: {
          created_at: string | null
          ghi_chu: string | null
          hinh_thuc_thanh_toan: string | null
          ma_cn: string
          ma_hdbh: string
          ma_kh: string | null
          ma_nv_bh: string
          ngay_gio_giao_dich: string
          so_tien_giam_gia: number | null
          so_tien_khach_dua: number
          so_tien_thoi_lai: number | null
          tong_gia_tri_truoc_giam: number
          tong_tien_thanh_toan: number
          trang_thai_hoa_don: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ghi_chu?: string | null
          hinh_thuc_thanh_toan?: string | null
          ma_cn: string
          ma_hdbh: string
          ma_kh?: string | null
          ma_nv_bh: string
          ngay_gio_giao_dich: string
          so_tien_giam_gia?: number | null
          so_tien_khach_dua: number
          so_tien_thoi_lai?: number | null
          tong_gia_tri_truoc_giam: number
          tong_tien_thanh_toan: number
          trang_thai_hoa_don?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ghi_chu?: string | null
          hinh_thuc_thanh_toan?: string | null
          ma_cn?: string
          ma_hdbh?: string
          ma_kh?: string | null
          ma_nv_bh?: string
          ngay_gio_giao_dich?: string
          so_tien_giam_gia?: number | null
          so_tien_khach_dua?: number
          so_tien_thoi_lai?: number | null
          tong_gia_tri_truoc_giam?: number
          tong_tien_thanh_toan?: number
          trang_thai_hoa_don?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hoa_don_ban_hang_ma_cn_fkey"
            columns: ["ma_cn"]
            isOneToOne: false
            referencedRelation: "chi_nhanh"
            referencedColumns: ["ma_cn"]
          },
          {
            foreignKeyName: "hoa_don_ban_hang_ma_kh_fkey"
            columns: ["ma_kh"]
            isOneToOne: false
            referencedRelation: "khach_hang"
            referencedColumns: ["ma_kh"]
          },
          {
            foreignKeyName: "hoa_don_ban_hang_ma_nv_bh_fkey"
            columns: ["ma_nv_bh"]
            isOneToOne: false
            referencedRelation: "nhan_vien"
            referencedColumns: ["ma_nv"]
          },
        ]
      }
      khach_hang: {
        Row: {
          created_at: string | null
          dia_chi: string | null
          diem_tich_luy: number | null
          email: string | null
          gioi_tinh: string | null
          hang_thanh_vien: string | null
          ho_ten: string
          ma_kh: string
          ngay_dang_ky: string | null
          ngay_sinh: string | null
          sdt: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dia_chi?: string | null
          diem_tich_luy?: number | null
          email?: string | null
          gioi_tinh?: string | null
          hang_thanh_vien?: string | null
          ho_ten: string
          ma_kh: string
          ngay_dang_ky?: string | null
          ngay_sinh?: string | null
          sdt: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dia_chi?: string | null
          diem_tich_luy?: number | null
          email?: string | null
          gioi_tinh?: string | null
          hang_thanh_vien?: string | null
          ho_ten?: string
          ma_kh?: string
          ngay_dang_ky?: string | null
          ngay_sinh?: string | null
          sdt?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nha_cung_cap: {
        Row: {
          created_at: string | null
          dia_chi: string | null
          email: string | null
          ma_ncc: string
          ma_so_thue: string | null
          nguoi_lien_he: string | null
          sdt: string | null
          ten_cong_ty: string
          trang_thai_hop_tac: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dia_chi?: string | null
          email?: string | null
          ma_ncc: string
          ma_so_thue?: string | null
          nguoi_lien_he?: string | null
          sdt?: string | null
          ten_cong_ty: string
          trang_thai_hop_tac?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dia_chi?: string | null
          email?: string | null
          ma_ncc?: string
          ma_so_thue?: string | null
          nguoi_lien_he?: string | null
          sdt?: string | null
          ten_cong_ty?: string
          trang_thai_hop_tac?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nhan_vien: {
        Row: {
          cccd: string | null
          created_at: string | null
          dia_chi_thuong_tru: string | null
          email: string | null
          gioi_tinh: string | null
          ho_ten: string
          ma_cn: string
          ma_giam_sat: string | null
          ma_nv: string
          ngay_sinh: string | null
          ngay_vao_lam: string | null
          sdt: string | null
          trang_thai_lam_viec: string | null
          updated_at: string | null
        }
        Insert: {
          cccd?: string | null
          created_at?: string | null
          dia_chi_thuong_tru?: string | null
          email?: string | null
          gioi_tinh?: string | null
          ho_ten: string
          ma_cn: string
          ma_giam_sat?: string | null
          ma_nv: string
          ngay_sinh?: string | null
          ngay_vao_lam?: string | null
          sdt?: string | null
          trang_thai_lam_viec?: string | null
          updated_at?: string | null
        }
        Update: {
          cccd?: string | null
          created_at?: string | null
          dia_chi_thuong_tru?: string | null
          email?: string | null
          gioi_tinh?: string | null
          ho_ten?: string
          ma_cn?: string
          ma_giam_sat?: string | null
          ma_nv?: string
          ngay_sinh?: string | null
          ngay_vao_lam?: string | null
          sdt?: string | null
          trang_thai_lam_viec?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nhan_vien_ma_cn_fkey"
            columns: ["ma_cn"]
            isOneToOne: false
            referencedRelation: "chi_nhanh"
            referencedColumns: ["ma_cn"]
          },
          {
            foreignKeyName: "nhan_vien_ma_giam_sat_fkey"
            columns: ["ma_giam_sat"]
            isOneToOne: false
            referencedRelation: "nhan_vien"
            referencedColumns: ["ma_nv"]
          },
        ]
      }
      phieu_nhap: {
        Row: {
          created_at: string | null
          ghi_chu: string | null
          ma_cn: string
          ma_ncc: string
          ma_nv_kho: string
          ma_phieu_nhap: string
          ngay_gio_nhap: string
          so_tien_da_thanh_toan: number | null
          tong_gia_tri: number
          trang_thai_thanh_toan: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ghi_chu?: string | null
          ma_cn: string
          ma_ncc: string
          ma_nv_kho: string
          ma_phieu_nhap: string
          ngay_gio_nhap: string
          so_tien_da_thanh_toan?: number | null
          tong_gia_tri: number
          trang_thai_thanh_toan?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ghi_chu?: string | null
          ma_cn?: string
          ma_ncc?: string
          ma_nv_kho?: string
          ma_phieu_nhap?: string
          ngay_gio_nhap?: string
          so_tien_da_thanh_toan?: number | null
          tong_gia_tri?: number
          trang_thai_thanh_toan?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phieu_nhap_ma_cn_fkey"
            columns: ["ma_cn"]
            isOneToOne: false
            referencedRelation: "chi_nhanh"
            referencedColumns: ["ma_cn"]
          },
          {
            foreignKeyName: "phieu_nhap_ma_ncc_fkey"
            columns: ["ma_ncc"]
            isOneToOne: false
            referencedRelation: "nha_cung_cap"
            referencedColumns: ["ma_ncc"]
          },
          {
            foreignKeyName: "phieu_nhap_ma_nv_kho_fkey"
            columns: ["ma_nv_kho"]
            isOneToOne: false
            referencedRelation: "nhan_vien"
            referencedColumns: ["ma_nv"]
          },
        ]
      }
      san_pham: {
        Row: {
          created_at: string | null
          don_vi_tinh: string | null
          gia_ban_le: number | null
          gia_cap_nhat_gan_nhat: number | null
          ma_dm: string
          ma_phieu_nhap_cuoi: string | null
          ma_sp: string
          ma_vach: string | null
          mo_ta: string | null
          ngay_them_vao: string | null
          stt_dong_nhap_cuoi: number | null
          ten_sp: string
          trang_thai_sp: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          don_vi_tinh?: string | null
          gia_ban_le?: number | null
          gia_cap_nhat_gan_nhat?: number | null
          ma_dm: string
          ma_phieu_nhap_cuoi?: string | null
          ma_sp: string
          ma_vach?: string | null
          mo_ta?: string | null
          ngay_them_vao?: string | null
          stt_dong_nhap_cuoi?: number | null
          ten_sp: string
          trang_thai_sp?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          don_vi_tinh?: string | null
          gia_ban_le?: number | null
          gia_cap_nhat_gan_nhat?: number | null
          ma_dm?: string
          ma_phieu_nhap_cuoi?: string | null
          ma_sp?: string
          ma_vach?: string | null
          mo_ta?: string | null
          ngay_them_vao?: string | null
          stt_dong_nhap_cuoi?: number | null
          ten_sp?: string
          trang_thai_sp?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "san_pham_ma_dm_fkey"
            columns: ["ma_dm"]
            isOneToOne: false
            referencedRelation: "danh_muc_san_pham"
            referencedColumns: ["ma_dm"]
          },
        ]
      }
      san_pham_nha_cung_cap: {
        Row: {
          created_at: string | null
          gia_nhap_gan_nhat: number | null
          ma_ncc: string
          ma_sp: string
          ngay_cap_nhat_gia: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gia_nhap_gan_nhat?: number | null
          ma_ncc: string
          ma_sp: string
          ngay_cap_nhat_gia?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gia_nhap_gan_nhat?: number | null
          ma_ncc?: string
          ma_sp?: string
          ngay_cap_nhat_gia?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "san_pham_nha_cung_cap_ma_ncc_fkey"
            columns: ["ma_ncc"]
            isOneToOne: false
            referencedRelation: "nha_cung_cap"
            referencedColumns: ["ma_ncc"]
          },
          {
            foreignKeyName: "san_pham_nha_cung_cap_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      thuoc_tinh_san_pham: {
        Row: {
          created_at: string | null
          ma_sp: string
          thuoc_tinh_sp: string
        }
        Insert: {
          created_at?: string | null
          ma_sp: string
          thuoc_tinh_sp: string
        }
        Update: {
          created_at?: string | null
          ma_sp?: string
          thuoc_tinh_sp?: string
        }
        Relationships: [
          {
            foreignKeyName: "thuoc_tinh_san_pham_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      ton_kho: {
        Row: {
          created_at: string | null
          ma_cn: string
          ma_sp: string
          ngay_cap_nhat: string | null
          so_luong_toi_da: number | null
          so_luong_toi_thieu: number | null
          so_luong_ton: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ma_cn: string
          ma_sp: string
          ngay_cap_nhat?: string | null
          so_luong_toi_da?: number | null
          so_luong_toi_thieu?: number | null
          so_luong_ton?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ma_cn?: string
          ma_sp?: string
          ngay_cap_nhat?: string | null
          so_luong_toi_da?: number | null
          so_luong_toi_thieu?: number | null
          so_luong_ton?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ton_kho_ma_cn_fkey"
            columns: ["ma_cn"]
            isOneToOne: false
            referencedRelation: "chi_nhanh"
            referencedColumns: ["ma_cn"]
          },
          {
            foreignKeyName: "ton_kho_ma_sp_fkey"
            columns: ["ma_sp"]
            isOneToOne: false
            referencedRelation: "san_pham"
            referencedColumns: ["ma_sp"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          ma_nv: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          ma_nv?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          ma_nv?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_ma_nv_fkey"
            columns: ["ma_nv"]
            isOneToOne: false
            referencedRelation: "nhan_vien"
            referencedColumns: ["ma_nv"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "quan_ly" | "ban_hang" | "kho" | "ke_toan"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "quan_ly", "ban_hang", "kho", "ke_toan"],
    },
  },
} as const
