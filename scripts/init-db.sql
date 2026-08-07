-- =============================================================
-- WebAtlas GIS - PostGIS Initial Spatial Database Setup Script
-- Automatically loaded on initial PostGIS container startup via
-- /docker-entrypoint-initdb.d/init-db.sql
-- =============================================================

-- Enable PostGIS spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- -------------------------------------------------------------
-- BẢNG DỮ LIỆU ĐỊA LÝ & THUỘC TÍNH (SPATIAL SCHEMAS)
-- -------------------------------------------------------------

-- 1. Bảng Ranh giới Tỉnh/Thành phố (bien_gioi_tinh)
DROP TABLE IF EXISTS bien_gioi_tinh CASCADE;
CREATE TABLE bien_gioi_tinh (
    id SERIAL PRIMARY KEY,
    ten_tinh VARCHAR(100) NOT NULL,
    ma_tinh VARCHAR(20),
    geom GEOMETRY(Polygon, 4326)
);

-- 2. Bảng Ranh giới Xã/Phường (ranh_gioi_xa)
DROP TABLE IF EXISTS ranh_gioi_xa CASCADE;
CREATE TABLE ranh_gioi_xa (
    id SERIAL PRIMARY KEY,
    ten_xa VARCHAR(100) NOT NULL,
    ten_huyen VARCHAR(100),
    ten_tinh VARCHAR(100),
    geom GEOMETRY(Polygon, 4326)
);

-- 3. Bảng Mạng lưới Sông suối & Thủy hệ (he_thong_song_suoi)
DROP TABLE IF EXISTS he_thong_song_suoi CASCADE;
CREATE TABLE he_thong_song_suoi (
    id SERIAL PRIMARY KEY,
    ten_song VARCHAR(150) NOT NULL,
    cap_song INT DEFAULT 1,
    chieu_dai_km NUMERIC(10, 2),
    geom GEOMETRY(MultiLineString, 4326)
);

-- 4. Bảng Hệ thống Đê điều & Công trình thủy lợi (he_thong_de_dieu)
DROP TABLE IF EXISTS he_thong_de_dieu CASCADE;
CREATE TABLE he_thong_de_dieu (
    id SERIAL PRIMARY KEY,
    ten_tuyen_de VARCHAR(150) NOT NULL,
    cap_de VARCHAR(50),
    chieu_dai_km NUMERIC(10, 2),
    geom GEOMETRY(MultiLineString, 4326)
);

-- 5. Bảng Đập & Hồ chứa thủy điện (ho_chua_dap)
DROP TABLE IF EXISTS ho_chua_dap CASCADE;
CREATE TABLE ho_chua_dap (
    id SERIAL PRIMARY KEY,
    ten_cong_trinh VARCHAR(150) NOT NULL,
    dung_tich_trieu_m3 NUMERIC(10, 2),
    cong_suat_mw NUMERIC(10, 2),
    tinh_trang VARCHAR(50) DEFAULT 'Hoạt động',
    geom GEOMETRY(Point, 4326)
);

-- 6. Bảng Trạm quan trắc thủy văn & đo mưa (tram_quan_trac)
DROP TABLE IF EXISTS tram_quan_trac CASCADE;
CREATE TABLE tram_quan_trac (
    id SERIAL PRIMARY KEY,
    ten_tram VARCHAR(150) NOT NULL,
    loai_tram VARCHAR(50),
    tinh_trang VARCHAR(50) DEFAULT 'Hoạt động',
    gia_tri_hien_tai VARCHAR(100),
    geom GEOMETRY(Point, 4326)
);

-- 7. Bảng Vùng nguy cơ Ngập lụt (vung_ngap_lut)
DROP TABLE IF EXISTS vung_ngap_lut CASCADE;
CREATE TABLE vung_ngap_lut (
    id SERIAL PRIMARY KEY,
    ten_vung VARCHAR(150) NOT NULL,
    muc_do_nguy_co VARCHAR(50),
    do_sau_ngap_m NUMERIC(5, 2),
    geom GEOMETRY(Polygon, 4326)
);

-- 8. Bảng Khảo sát Hạn hán (khao_sat_han_han)
DROP TABLE IF EXISTS khao_sat_han_han CASCADE;
CREATE TABLE khao_sat_han_han (
    id SERIAL PRIMARY KEY,
    ten_diem VARCHAR(150) NOT NULL,
    cap_do_han VARCHAR(50),
    do_am_dat VARCHAR(50),
    geom GEOMETRY(Point, 4326)
);

-- 9. Bảng Điểm Xâm nhập mặn (xam_nhap_man)
DROP TABLE IF EXISTS xam_nhap_man CASCADE;
CREATE TABLE xam_nhap_man (
    id SERIAL PRIMARY KEY,
    ten_diem VARCHAR(150) NOT NULL,
    do_man_g_l NUMERIC(5, 2),
    pham_vi_anh_huong_km NUMERIC(5, 2),
    geom GEOMETRY(Point, 4326)
);

-- 10. Bảng Vùng Sinh lũ thượng nguồn (vung_sinh_luu)
DROP TABLE IF EXISTS vung_sinh_luu CASCADE;
CREATE TABLE vung_sinh_luu (
    id SERIAL PRIMARY KEY,
    ten_luu_vuc VARCHAR(150) NOT NULL,
    nguy_co_lu_quet VARCHAR(50),
    geom GEOMETRY(Polygon, 4326)
);

-- -------------------------------------------------------------
-- NẠP DỮ LIỆU KHỞI TẠO (DATA SEEDING)
-- -------------------------------------------------------------

-- 1. Ranh giới Tỉnh mẫu
INSERT INTO bien_gioi_tinh (ten_tinh, ma_tinh, geom) VALUES
('Phú Yên', 'PY', ST_GeomFromText('POLYGON((108.8 12.8, 109.4 12.8, 109.4 13.6, 108.8 13.6, 108.8 12.8))', 4326)),
('Gia Lai', 'GL', ST_GeomFromText('POLYGON((107.5 13.0, 108.7 13.0, 108.7 14.5, 107.5 14.5, 107.5 13.0))', 4326)),
('Bình Định', 'BD', ST_GeomFromText('POLYGON((108.6 13.5, 109.3 13.5, 109.3 14.7, 108.6 14.7, 108.6 13.5))', 4326)),
('Quảng Nam', 'QN', ST_GeomFromText('POLYGON((107.2 15.0, 108.6 15.0, 108.6 16.0, 107.2 16.0, 107.2 15.0))', 4326));

-- 2. Ranh giới Xã/Phường mẫu
INSERT INTO ranh_gioi_xa (ten_xa, ten_huyen, ten_tinh, geom) VALUES
('Phường 1', 'TP. Tuy Hòa', 'Phú Yên', ST_GeomFromText('POLYGON((109.28 13.07, 109.32 13.07, 109.32 13.11, 109.28 13.11, 109.28 13.07))', 4326)),
('Xã Hòa An', 'Huyện Phú Hòa', 'Phú Yên', ST_GeomFromText('POLYGON((109.20 13.05, 109.28 13.05, 109.28 13.12, 109.20 13.12, 109.20 13.05))', 4326)),
('Phường Tân Giang', 'TP. Tam Kỳ', 'Quảng Nam', ST_GeomFromText('POLYGON((108.45 15.54, 108.52 15.54, 108.52 15.60, 108.45 15.60, 108.45 15.54))', 4326));

-- 3. Mạng lưới Sông suối (Thủy hệ)
INSERT INTO he_thong_song_suoi (ten_song, cap_song, chieu_dai_km, geom) VALUES
('Sông Ba', 1, 388.0, ST_GeomFromText('MULTILINESTRING((108.05 14.20, 108.35 13.80, 108.80 13.40, 109.25 13.10, 109.32 13.09))', 4326)),
('Sông Hinh', 2, 65.0, ST_GeomFromText('MULTILINESTRING((108.95 12.85, 109.05 12.95, 109.12 13.02))', 4326)),
('Sông Thu Bồn', 1, 198.0, ST_GeomFromText('MULTILINESTRING((107.80 15.30, 108.10 15.50, 108.35 15.85))', 4326));

-- 4. Hệ thống Đê điều
INSERT INTO he_thong_de_dieu (ten_tuyen_de, cap_de, chieu_dai_km, geom) VALUES
('Tuyến đê biển Đà Diễn', 'Đê cấp III', 12.5, ST_GeomFromText('MULTILINESTRING((109.30 13.05, 109.33 13.12))', 4326)),
('Tuyến đê bao sông Thu Bồn', 'Đê cấp II', 18.0, ST_GeomFromText('MULTILINESTRING((108.40 15.55, 108.48 15.58))', 4326));

-- 5. Đập & Hồ chứa thủy điện
INSERT INTO ho_chua_dap (ten_cong_trinh, dung_tich_trieu_m3, cong_suat_mw, tinh_trang, geom) VALUES
('Thủy điện Sông Hinh', 357.0, 70.0, 'Hoạt động', ST_SetSRID(ST_MakePoint(109.02, 12.92), 4326)),
('Thủy điện An Khê - Kanak', 159.0, 160.0, 'Hoạt động', ST_SetSRID(ST_MakePoint(108.08, 13.96), 4326)),
('Thủy điện Sông Ba Hạ', 166.0, 220.0, 'Hoạt động', ST_SetSRID(ST_MakePoint(108.73, 13.31), 4326));

-- 6. Trạm quan trắc thủy văn & đo mưa
INSERT INTO tram_quan_trac (ten_tram, loai_tram, tinh_trang, gia_tri_hien_tai, geom) VALUES
('Trạm Thủy văn An Khê', 'Đo mực nước', 'Hoạt động', 'Mực nước: 2.3m', ST_SetSRID(ST_MakePoint(108.07, 13.95), 4326)),
('Trạm Đo mưa Củng Sơn', 'Đo mưa tự động', 'Hoạt động', 'Lượng mưa: 45mm/24h', ST_SetSRID(ST_MakePoint(108.98, 13.04), 4326)),
('Trạm Thủy văn Phú Lâm', 'Đo mực nước & lưu lượng', 'Hoạt động', 'Lưu lượng: 120m3/s', ST_SetSRID(ST_MakePoint(109.30, 13.08), 4326));

-- 7. Vùng nguy cơ Ngập lụt
INSERT INTO vung_ngap_lut (ten_vung, muc_do_nguy_co, do_sau_ngap_m, geom) VALUES
('Vùng ngập lụt hạ lưu Sông Ba (Tuy Hòa)', 'Nguy cơ Cao', 1.8, ST_GeomFromText('POLYGON((109.25 13.05, 109.33 13.05, 109.33 13.12, 109.25 13.12, 109.25 13.05))', 4326)),
('Vùng ngập lụt Tam Kỳ', 'Nguy cơ Trung bình', 1.2, ST_GeomFromText('POLYGON((108.45 15.53, 108.53 15.53, 108.53 15.61, 108.45 15.61, 108.45 15.53))', 4326));

-- 8. Khảo sát Hạn hán
INSERT INTO khao_sat_han_han (ten_diem, cap_do_han, do_am_dat, geom) VALUES
('Trạm Pleiku', 'Hạn nặng', 'Độ ẩm: 28%', ST_SetSRID(ST_MakePoint(108.00, 13.98), 4326)),
('Dự án Sông Hinh', 'Hạn trung bình', 'Độ ẩm: 42%', ST_SetSRID(ST_MakePoint(108.92, 12.90), 4326));

-- 9. Điểm Xâm nhập mặn
INSERT INTO xam_nhap_man (ten_diem, do_man_g_l, pham_vi_anh_huong_km, geom) VALUES
('Cửa sông Đà Diễn', 4.5, 12.0, ST_SetSRID(ST_MakePoint(109.32, 13.08), 4326)),
('Đầm Thị Nại', 3.8, 8.5, ST_SetSRID(ST_MakePoint(109.25, 13.80), 4326));

-- 10. Vùng Sinh lũ thượng nguồn
INSERT INTO vung_sinh_luu (ten_luu_vuc, nguy_co_lu_quet, geom) VALUES
('Thượng nguồn Sông Ba', 'Cực kỳ nguy hiểm', ST_GeomFromText('POLYGON((108.00 14.00, 108.30 14.00, 108.30 14.35, 108.00 14.35, 108.00 14.00))', 4326)),
('Thượng nguồn Sa Thầy', 'Nguy cơ Cao', ST_GeomFromText('POLYGON((107.40 14.20, 107.80 14.20, 107.80 14.60, 107.40 14.60, 107.40 14.20))', 4326));

-- -------------------------------------------------------------
-- TẠO CHỈ MỤC KHÔNG GIAN (SPATIAL INDEXES) CHO HIỆU NĂNG TỐI ƯU
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bien_gioi_tinh_geom ON bien_gioi_tinh USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_ranh_gioi_xa_geom ON ranh_gioi_xa USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_he_thong_song_suoi_geom ON he_thong_song_suoi USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_he_thong_de_dieu_geom ON he_thong_de_dieu USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_ho_chua_dap_geom ON ho_chua_dap USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_tram_quan_trac_geom ON tram_quan_trac USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_vung_ngap_lut_geom ON vung_ngap_lut USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_khao_sat_han_han_geom ON khao_sat_han_han USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_xam_nhap_man_geom ON xam_nhap_man USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_vung_sinh_luu_geom ON vung_sinh_luu USING GIST (geom);
