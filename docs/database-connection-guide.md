# Hướng dẫn Kết nối Database PostGIS & WebGIS cho Máy khác trong Mạng

Tài liệu này hướng dẫn cách kết nối từ các máy tính khác trong mạng LAN/Internet tới hệ thống WebAtlas (Database PostGIS và ứng dụng WebGIS).

---

## 1. Thông tin Kết nối Database PostGIS

Bất kỳ phần mềm GIS nào (như **QGIS**, **ArcGIS**, **DBeaver**, **pgAdmin**, hoặc ứng dụng backend riêng) đều có thể kết nối trực tiếp tới Database PostGIS bằng thông tin sau:

- **Host (Địa chỉ IP máy chủ)**: `<IP_CUA_MAY_CHU_DATABASE>` (Ví dụ: `192.168.1.50` hoặc Domain/IP Public)
- **Port**: `5432`
- **Database Name**: `gis`
- **Username**: `postgres`
- **Password**: `postgres`

---

## 2. Hướng dẫn Kết nối từ QGIS

1. Mở phần mềm **QGIS** trên máy tính khác.
2. Tại bảng **Browser** bên trái, click chuột phải vào **PostGIS** -> chọn **New Connection...**
3. Điền các thông số:
   - **Name**: `WebAtlas Central DB`
   - **Host**: IP của máy chủ chứa Docker (Ví dụ: `192.168.1.50`)
   - **Port**: `5432`
   - **Database**: `gis`
   - **Authentication**: Điền User `postgres` và Password `postgres`.
4. Nhấn **Test Connection** -> Khi báo thành công, nhấn **OK**.
5. Bây giờ bạn có thể kéo thả toàn bộ các lớp `bien_gioi_tinh`, `ranh_gioi_xa`, `he_thong_song_suoi`, `he_thong_de_dieu`, `ho_chua_dap` vào màn hình QGIS để làm việc và chỉnh sửa trực tiếp!

---

## 3. Hướng dẫn Xem Bản đồ trên Trình duyệt Web từ Máy khác

1. Đảm bảo Docker trên máy chủ đang chạy: `docker compose up -d`
2. Mở trình duyệt Web (Chrome, Edge, Firefox, Safari) trên máy khác (hoặc điện thoại trong cùng mạng Wifi/LAN).
3. Gõ đường dẫn:
   `http://<IP_CUA_MAY_CHU>/`
   *(Ví dụ: `http://192.168.1.50/`)*
4. Toàn bộ bản đồ nền và các lớp dữ liệu WMS/WFS từ PostGIS sẽ hiển thị đầy đủ và ổn định.

---

## 4. Danh sách các Bảng Dữ liệu Không gian trong PostGIS

| Tên bảng trong PostGIS | Loại dữ liệu | Tương ứng Lớp WMS | Mô tả |
| :--- | :--- | :--- | :--- |
| `bien_gioi_tinh` | Polygon | `diaphantinh` | Ranh giới Tỉnh/Thành phố |
| `ranh_gioi_xa` | Polygon | `gadm41_vnm_3` | Ranh giới Xã/Phường |
| `he_thong_song_suoi` | MultiLineString | `thuyhe` | Mạng lưới Sông suối & Thủy hệ |
| `he_thong_de_dieu` | MultiLineString | `de_dieu` | Hệ thống Đê điều & Thủy lợi |
| `ho_chua_dap` | Point | `thuydienvietnam` | Đập & Hồ chứa thủy điện |
| `tram_quan_trac` | Point | `tram_quan_trac` | Trạm quan trắc đo mưa & mực nước |
| `vung_ngap_lut` | Polygon | `vung_ngap_lut` | Vùng nguy cơ Ngập lụt |
| `khao_sat_han_han` | Point | `khao_sat_han_han` | Điểm khảo sát hạn hán |
| `xam_nhap_man` | Point | `xam_nhap_man` | Điểm đo xâm nhập mặn |
| `vung_sinh_luu` | Polygon | `vung_sinh_luu` | Vùng sinh lũ thượng nguồn |
