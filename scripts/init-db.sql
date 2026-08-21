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
    fid SERIAL PRIMARY KEY,
    adm1_name VARCHAR(100),
    adm1_name1 VARCHAR(100),
    adm1_pcode VARCHAR(20),
    geom GEOMETRY(MultiPolygon, 4326)
);

-- 2. Bảng Ranh giới Quốc gia / Hành chính (bien_gioi_quoc_gia)
DROP TABLE IF EXISTS bien_gioi_quoc_gia CASCADE;
CREATE TABLE bien_gioi_quoc_gia (
    fid SERIAL PRIMARY KEY,
    adm0_name VARCHAR(100),
    iso3 VARCHAR(10),
    geom GEOMETRY(MultiPolygon, 4326)
);

-- 3. Bảng Mạng lưới Sông suối & Thủy hệ (song_suoi)
DROP TABLE IF EXISTS song_suoi CASCADE;
CREATE TABLE song_suoi (
    fid SERIAL PRIMARY KEY,
    ten VARCHAR(150),
    cap INT DEFAULT 1,
    chieu_dai NUMERIC(10, 2),
    geom GEOMETRY(MultiLineString, 4326)
);

-- 4. Bảng Đập & Hồ chứa thủy điện (ho_chua_dap)
DROP TABLE IF EXISTS ho_chua_dap CASCADE;
CREATE TABLE ho_chua_dap (
    fid SERIAL PRIMARY KEY,
    id INT,
    ten_cong_trinh VARCHAR(150),
    vietnamese VARCHAR(150),
    english_hy VARCHAR(150),
    dung_tich_trieu_m3 NUMERIC(10, 2),
    cong_suat_mw NUMERIC(10, 2),
    wattage_pl NUMERIC(10, 2),
    "quantity_(" NUMERIC(10, 2),
    year_of_la VARCHAR(50),
    year_of_op VARCHAR(50),
    tinh_trang VARCHAR(50) DEFAULT 'Hoạt động',
    x DOUBLE PRECISION,
    y DOUBLE PRECISION,
    geom GEOMETRY(Geometry, 4326)
);

-- 5. Bảng Hồ mặt nước (ho_mat_nuoc)
DROP TABLE IF EXISTS ho_mat_nuoc CASCADE;
CREATE TABLE ho_mat_nuoc (
    fid SERIAL PRIMARY KEY,
    osm_id VARCHAR(50),
    code INT DEFAULT 8200,
    fclass VARCHAR(50) DEFAULT 'water',
    name VARCHAR(150),
    geom GEOMETRY(MultiPolygon, 4326)
);

-- 6. Bảng Đường sắt Việt Nam (duong_sat_viet_nam)
DROP TABLE IF EXISTS duong_sat_viet_nam CASCADE;
CREATE TABLE duong_sat_viet_nam (
    fid SERIAL PRIMARY KEY,
    osm_id VARCHAR(50),
    code INT,
    fclass VARCHAR(50),
    name VARCHAR(150),
    geom GEOMETRY(MultiLineString, 4326)
);

-- 7. Bảng Giao thông đường bộ (giao_thong_duong_di)
DROP TABLE IF EXISTS giao_thong_duong_di CASCADE;
CREATE TABLE giao_thong_duong_di (
    fid SERIAL PRIMARY KEY,
    osm_id VARCHAR(50),
    code INT,
    fclass VARCHAR(50),
    name VARCHAR(150),
    ref VARCHAR(50),
    oneway VARCHAR(10),
    maxspeed INT,
    layer INT,
    bridge VARCHAR(10),
    tunnel VARCHAR(10),
    geom GEOMETRY(MultiLineString, 4326)
);

-- 8. Bảng Địa điểm dân cư (dia_diem_dan_cu)
DROP TABLE IF EXISTS dia_diem_dan_cu CASCADE;
CREATE TABLE dia_diem_dan_cu (
    fid SERIAL PRIMARY KEY,
    osm_id VARCHAR(50),
    code INT,
    fclass VARCHAR(50),
    population INT,
    name VARCHAR(150),
    geom GEOMETRY(MultiPoint, 4326)
);

-- 9. Bảng Phủ bề mặt / Sử dụng đất (phu_be_mat_su_dung_dat)
DROP TABLE IF EXISTS phu_be_mat_su_dung_dat CASCADE;
CREATE TABLE phu_be_mat_su_dung_dat (
    fid SERIAL PRIMARY KEY,
    osm_id VARCHAR(50),
    code INT,
    fclass VARCHAR(50),
    name VARCHAR(150),
    geom GEOMETRY(MultiPolygon, 4326)
);

-- 10. Bảng Trạm quan trắc thủy văn & đo mưa (tram_quan_trac)
DROP TABLE IF EXISTS tram_quan_trac CASCADE;
CREATE TABLE tram_quan_trac (
    fid SERIAL PRIMARY KEY,
    ten_tram VARCHAR(150),
    loai_tram VARCHAR(50),
    tinh_trang VARCHAR(50) DEFAULT 'Hoạt động',
    gia_tri_hien_tai VARCHAR(100),
    geom GEOMETRY(Point, 4326)
);

-- 11. Bảng Vùng nguy cơ Ngập lụt (vung_ngap_lut)
DROP TABLE IF EXISTS vung_ngap_lut CASCADE;
CREATE TABLE vung_ngap_lut (
    fid SERIAL PRIMARY KEY,
    ten_vung VARCHAR(150),
    muc_do_nguy_co VARCHAR(50),
    do_sau_ngap_m NUMERIC(5, 2),
    geom GEOMETRY(Polygon, 4326)
);

-- 12. Bảng Khảo sát Hạn hán (khao_sat_han_han)
DROP TABLE IF EXISTS khao_sat_han_han CASCADE;
CREATE TABLE khao_sat_han_han (
    fid SERIAL PRIMARY KEY,
    ten_diem VARCHAR(150),
    cap_do_han VARCHAR(50),
    do_am_dat VARCHAR(50),
    geom GEOMETRY(Point, 4326)
);

-- 13. Bảng Điểm Xâm nhập mặn (xam_nhap_man)
DROP TABLE IF EXISTS xam_nhap_man CASCADE;
CREATE TABLE xam_nhap_man (
    fid SERIAL PRIMARY KEY,
    ten_diem VARCHAR(150),
    do_man_g_l NUMERIC(5, 2),
    pham_vi_anh_huong_km NUMERIC(5, 2),
    geom GEOMETRY(Point, 4326)
);

-- 14. Bảng Vùng Sinh lũ thượng nguồn (luu_vuc_sinh_luu)
DROP TABLE IF EXISTS luu_vuc_sinh_luu CASCADE;
CREATE TABLE luu_vuc_sinh_luu (
    fid SERIAL PRIMARY KEY,
    ten_luu_vuc VARCHAR(150),
    nguy_co_lu_quet VARCHAR(50),
    geom GEOMETRY(Polygon, 4326)
);

-- -------------------------------------------------------------
-- NẠP DỮ LIỆU KHỞI TẠO (DATA SEEDING)
-- -------------------------------------------------------------

INSERT INTO bien_gioi_tinh (adm1_name, adm1_name1, adm1_pcode, geom) VALUES
('Phú Yên', 'Phú Yên', 'PY', ST_GeomFromText('MULTIPOLYGON(((108.8 12.8, 109.4 12.8, 109.4 13.6, 108.8 13.6, 108.8 12.8)))', 4326)),
('Gia Lai', 'Gia Lai', 'GL', ST_GeomFromText('MULTIPOLYGON(((107.5 13.0, 108.7 13.0, 108.7 14.5, 107.5 14.5, 107.5 13.0)))', 4326)),
('Bình Định', 'Bình Định', 'BD', ST_GeomFromText('MULTIPOLYGON(((108.6 13.5, 109.3 13.5, 109.3 14.7, 108.6 14.7, 108.6 13.5)))', 4326)),
('Quảng Nam', 'Quảng Nam', 'QN', ST_GeomFromText('MULTIPOLYGON(((107.2 15.0, 108.6 15.0, 108.6 16.0, 107.2 16.0, 107.2 15.0)))', 4326));

INSERT INTO bien_gioi_quoc_gia (adm0_name, iso3, geom) VALUES
('Việt Nam', 'VNM', ST_GeomFromText('MULTIPOLYGON(((102.1 8.5, 109.5 8.5, 109.5 23.4, 102.1 23.4, 102.1 8.5)))', 4326));

INSERT INTO song_suoi (ten, cap, chieu_dai, geom) VALUES
('Sông Ba', 1, 388.0, ST_GeomFromText('MULTILINESTRING((108.05 14.20, 108.35 13.80, 108.80 13.40, 109.25 13.10, 109.32 13.09))', 4326)),
('Sông Hinh', 2, 65.0, ST_GeomFromText('MULTILINESTRING((108.95 12.85, 109.05 12.95, 109.12 13.02))', 4326)),
('Sông Thu Bồn', 1, 198.0, ST_GeomFromText('MULTILINESTRING((107.80 15.30, 108.10 15.50, 108.35 15.85))', 4326));

INSERT INTO ho_chua_dap (id, ten_cong_trinh, vietnamese, english_hy, dung_tich_trieu_m3, cong_suat_mw, wattage_pl, "quantity_(", year_of_la, year_of_op, tinh_trang, x, y, geom) VALUES
(1, 'Thủy điện Sông Hinh', 'Thủy điện Sông Hinh', 'Song Hinh', 357.0, 70.0, 70.0, 370.0, '1993', '2001', 'Hoạt động', 109.02, 12.92, ST_SetSRID(ST_MakePoint(109.02, 12.92), 4326)),
(2, 'Thủy điện An Khê - Kanak', 'Thủy điện An Khê - Kanak', 'An Khe - Kanak', 159.0, 160.0, 160.0, 684.0, '2005', '2011', 'Hoạt động', 108.08, 13.96, ST_SetSRID(ST_MakePoint(108.08, 13.96), 4326)),
(3, 'Thủy điện Sông Ba Hạ', 'Thủy điện Sông Ba Hạ', 'Song Ba Ha', 166.0, 220.0, 220.0, 825.0, '2004', '2009', 'Hoạt động', 108.73, 13.31, ST_SetSRID(ST_MakePoint(108.73, 13.31), 4326));

INSERT INTO ho_mat_nuoc (osm_id, code, fclass, name, geom) VALUES
('9635863', 8200, 'water', 'Hồ Tây', ST_GeomFromText('MULTIPOLYGON(((105.81 21.05, 105.84 21.05, 105.84 21.08, 105.81 21.08, 105.81 21.05)))', 4326)),
('2388849', 8200, 'water', 'Hồ Hoàn Kiếm', ST_GeomFromText('MULTIPOLYGON(((105.85 21.02, 105.86 21.02, 105.86 21.04, 105.85 21.04, 105.85 21.02)))', 4326)),
('7782101', 8200, 'reservoir', 'Hồ Sông Hinh', ST_GeomFromText('MULTIPOLYGON(((108.98 12.88, 109.06 12.88, 109.06 12.96, 108.98 12.96, 108.98 12.88)))', 4326)),
('7782102', 8200, 'reservoir', 'Hồ Định Bình', ST_GeomFromText('MULTIPOLYGON(((108.78 14.08, 108.85 14.08, 108.85 14.15, 108.78 14.15, 108.78 14.08)))', 4326));

INSERT INTO tram_quan_trac (ten_tram, loai_tram, tinh_trang, gia_tri_hien_tai, geom) VALUES
('Trạm Thủy văn An Khê', 'Đo mực nước', 'Hoạt động', 'Mực nước: 2.3m', ST_SetSRID(ST_MakePoint(108.07, 13.95), 4326)),
('Trạm Đo mưa Củng Sơn', 'Đo mưa tự động', 'Hoạt động', 'Lượng mưa: 45mm/24h', ST_SetSRID(ST_MakePoint(108.98, 13.04), 4326)),
('Trạm Thủy văn Phú Lâm', 'Đo mực nước & lưu lượng', 'Hoạt động', 'Lưu lượng: 120m3/s', ST_SetSRID(ST_MakePoint(109.30, 13.08), 4326));

INSERT INTO vung_ngap_lut (ten_vung, muc_do_nguy_co, do_sau_ngap_m, geom) VALUES
('Vùng ngập lụt hạ lưu Sông Ba (Tuy Hòa)', 'Nguy cơ Cao', 1.8, ST_GeomFromText('POLYGON((109.25 13.05, 109.33 13.05, 109.33 13.12, 109.25 13.12, 109.25 13.05))', 4326)),
('Vùng ngập lụt Tam Kỳ', 'Nguy cơ Trung bình', 1.2, ST_GeomFromText('POLYGON((108.45 15.53, 108.53 15.53, 108.53 15.61, 108.45 15.61, 108.45 15.53))', 4326));

-- -------------------------------------------------------------
-- TẠO CHỈ MỤC KHÔNG GIAN (SPATIAL INDEXES)
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bien_gioi_tinh_geom ON bien_gioi_tinh USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_bien_gioi_quoc_gia_geom ON bien_gioi_quoc_gia USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_song_suoi_geom ON song_suoi USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_ho_chua_dap_geom ON ho_chua_dap USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_ho_mat_nuoc_geom ON ho_mat_nuoc USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_duong_sat_viet_nam_geom ON duong_sat_viet_nam USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_giao_thong_duong_di_geom ON giao_thong_duong_di USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_dia_diem_dan_cu_geom ON dia_diem_dan_cu USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_phu_be_mat_su_dung_dat_geom ON phu_be_mat_su_dung_dat USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_tram_quan_trac_geom ON tram_quan_trac USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_vung_ngap_lut_geom ON vung_ngap_lut USING GIST (geom);
