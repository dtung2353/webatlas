# Dự án WebAtlas - Ứng dụng WebGIS Giám sát Tài nguyên nước & Hiểm họa Thủy văn

Ứng dụng **WebAtlas** là hệ thống WebGIS hiện đại phục vụ giám sát tài nguyên nước, mạng lưới thủy hệ, đập & hồ chứa thủy điện và các vùng hiểm họa thủy văn (ngập lụt, hạn hán, xâm nhập mặn, vùng sinh lũ) khu vực Duyên hải Nam Trung Bộ & Tây Nguyên.

Hệ thống được phát triển theo mô hình **MVC (Model - View - Controller)**, kết hợp cùng các công nghệ GIS tiên tiến và đóng gói hệ sinh thái container bằng Docker.

---

## 🚀 Công nghệ Sử dụng (Tech Stack)

* **Giao diện Frontend**: React 19 + TypeScript + Vite
* **Thư viện Bản đồ**: OpenLayers 10
* **Kiến trúc Hệ thống**: Mô hình MVC (Model - View - Controller)
* **Máy chủ Bản đồ GIS**: Camptocamp MapServer 7.6 (Dịch vụ OGC WMS & WFS)
* **Cơ sở dữ liệu Địa lý**: PostgreSQL 16 + PostGIS 3.4
* **Đóng gói & Đóng container**: Docker & Docker Compose
* **Web Server & Reverse Proxy**: Nginx Alpine
* **Xuất Báo cáo**: jsPDF + HTML5 Canvas API

---

## 📑 Các Chức năng Chính của Hệ thống

1. **Bản đồ Nền Tương tác (Basemap Switcher)**:
   * Chuyển đổi linh hoạt giữa 3 lớp bản đồ nền: Nền Đường phố (CartoDB Light), Nền Vệ tinh (Esri Imagery), và Nền Địa hình (Esri DEM Hillshade).
2. **Cây Quản lý Lớp Dữ liệu (Layer Tree Management)**:
   * Bật/Tắt và tùy chỉnh độ mờ (Opacity slider 0% - 100%) cho các nhóm lớp dữ liệu:
     * **Ranh giới Hành chính**: Ranh giới Tỉnh/Thành phố và Ranh giới Xã/Phường.
     * **Tài nguyên Nước**: Đập & Hồ chứa thủy điện, Mạng lưới sông ngòi, Trạm quan trắc thủy văn/đo mưa.
     * **Hiểm họa Thủy văn**: Vùng ngập lụt, Khảo sát hạn hán, Xâm nhập mặn, Vùng sinh lũ.
3. **Cửa sổ Thông tin Động (Dynamic Popup & Detail Modal)**:
   * Nhấp chọn đối tượng trên bản đồ để xem thuộc tính WMS GetFeatureInfo từ MapServer hoặc Vector Layer.
   * Hiển thị bảng mô tả Cartodiagram (kích thước biểu tượng theo công suất, màu sắc theo trạng thái an toàn).
   * Mở **Modal Chi tiết Chuyên sâu**: Xem thông số kỹ thuật đập (chiều dài, chiều cao, cao trình đỉnh đập, loại vật liệu) và đánh giá hiện trạng an toàn đập (mái thượng lưu, rò rỉ nước).
   * Kích hoạt đường phát sáng (Highlight) sông được chọn hoặc tất cả các sông thuộc cùng lưu vực.
4. **Tìm kiếm Không gian & Bay tới Vị trí (Spatial Search & Fly-To)**:
   * Tìm kiếm thông minh tên Tỉnh, Xã/Phường, Đập thủy điện, Trạm quan trắc.
   * Tự động chuyển đổi góc nhìn (Animate fly-to & zoom) đến vị trí đối tượng và tự động mở Popup.
5. **Bộ Công cụ Đo đạc Không gian (Measurement Tools)**:
   * Công cụ di chuyển bản đồ (Pan tool).
   * Công cụ đo chiều dài đoạn sông / tuyến đường (Length measurement).
   * Công cụ đo diện tích vùng ngập lụt / hồ chứa (Area measurement).
6. **Tích hợp Dữ liệu OGC MapServer WMS ngoài**:
   * Nhập WMS Server URL và Tên lớp dữ liệu để nạp trực tiếp lớp bản đồ từ máy chủ GIS bên ngoài vào hệ thống.
7. **Xuất Báo cáo PDF Chuyên nghiệp (PDF Report Export)**:
   * Xuất báo cáo PDF 2 trang chất lượng cao trực tiếp từ trình duyệt.
   * Bao gồm **Ảnh chụp bản đồ hiện trạng thời gian thực**, **Ngày xuất bản chính xác**, **Bảng giải mã các ký hiệu bản đồ đang mở**, **Biểu đồ tròn phân bổ trạng thái an toàn đập**, **Biểu đồ cột công suất thủy điện** và bảng tổng hợp số liệu.
   * Hỗ trợ chuẩn hóa Tiếng Việt không dấu (ASCII) để đảm bảo 100% không bị lỗi font chữ trên mọi trình đọc PDF.

---

## 📂 Cấu trúc Thư mục Mã nguồn (Mô hình MVC)

```
webatlas/
├── public/                         # Các tệp tĩnh public (favicon, icons)
├── src/                            # Mã nguồn chính của ứng dụng Frontend
│   ├── controllers/                # [CONTROLLERS] Logic điều khiển ứng dụng
│   │   ├── MapController.tsx       # Context Provider trung tâm chia sẻ trạng thái Map, Layers, Popup
│   │   ├── useExportController.ts  # Controller xử lý quy trình xuất báo cáo PDF
│   │   ├── useMapController.ts     # Hook truy cập Map Context
│   │   └── useSearchController.ts  # Controller xử lý logic tìm kiếm & định vị flyTo
│   │
│   ├── models/                     # [MODELS] Quản lý cấu hình, dữ liệu & thuật toán xử lý
│   │   ├── appConfig.ts            # Cấu hình MapServer URL & API endpoints
│   │   ├── chartGeneratorModel.ts  # Dựng biểu đồ Donut & Bar chart qua HTML5 Canvas
│   │   ├── damDetailHelper.ts      # Tính toán thông số kỹ thuật đập & mức an toàn
│   │   ├── gmlParser.ts            # Parse tọa độ GML WFS từ MapServer
│   │   ├── gmlPopupParser.ts       # Parse kết quả GetFeatureInfo WMS từ MapServer
│   │   ├── layerConfig.ts          # Cấu hình nhóm danh mục các lớp bản đồ
│   │   ├── mapSnapshotModel.ts     # Trích xuất ảnh chụp từ OpenLayers Map canvas
│   │   ├── mapTypes.ts             # Định nghĩa TypeScript Interfaces & Types dùng chung
│   │   ├── mockData.ts             # GeoJSON mock data (Trạm, Ngập lụt, Hạn hán, Xâm nhập mặn)
│   │   └── pdfReportBuilderModel.ts# Đóng gói xuất tệp báo cáo PDF
│   │
│   ├── views/                      # [VIEWS] Các giao diện UI hiển thị cho người dùng
│   │   ├── export/                 # View nút bấm & modal xuất báo cáo PDF
│   │   │   └── PDFExportButtonView.tsx
│   │   ├── layers/                 # Views điều khiển lớp & bản đồ nền
│   │   │   ├── BasemapSwitcherView.tsx
│   │   │   └── LayerTreeView.tsx
│   │   ├── map/                    # Views khung bản đồ & thanh công cụ
│   │   │   ├── MapControlsView.tsx
│   │   │   └── MapView.tsx
│   │   ├── ogc/                    # View modal tích hợp WMS ngoài
│   │   │   └── OGCClientView.tsx
│   │   ├── popup/                  # Views hiển thị Popup thông tin & Chú giải
│   │   │   ├── DynamicLegendView.tsx
│   │   │   └── DynamicPopupView.tsx
│   │   └── search/                 # View thanh tìm kiếm
│   │       └── SearchBarView.tsx
│   │
│   ├── styles/                     # CSS StyleSheet hệ thống
│   │   └── main.css                # Phong cách thiết kế Glassmorphism & layouts
│   ├── App.tsx                     # Root Layout của ứng dụng (Kết nối Controllers & Views)
│   └── main.tsx                    # Điểm khởi chạy React Application
│
├── mapserver/                      # Cấu hình và dữ liệu cho MapServer GIS
│   ├── atlas.map                   # Tệp cấu hình Mapfile chính (WMS/WFS Layer definitions)
│   └── Du_An_WebAtlas_Nhom/        # Dữ liệu GIS không gian (.gpkg, GeoJSON, .shp)
├── Dockerfile                      # Multi-stage Docker build cho Frontend
├── docker-compose.yml              # Tệp điều phối Docker Compose (Web, MapServer, PostGIS)
├── docker-compose.share.yml        # Tệp Docker Compose dùng image đóng gói sẵn trên Docker Hub
├── nginx.conf                      # Cấu hình Nginx Web Server & Reverse Proxy
└── package.json                    # Khai báo các thư viện phụ thuộc của Node.js
```

---

## 🛠️ Hướng dẫn Khởi chạy Dự án

### Cách 1: Khởi chạy bằng Docker (Khuyên dùng)
Yêu cầu máy tính đã cài **Docker Desktop** (Windows/macOS) hoặc **Docker Engine** (Linux).

1. Mở Terminal tại thư mục dự án `webatlas`.
2. **Khởi động Server:**
   ```bash
   docker compose up -d
   ```
   *(Hoặc `docker compose up -d --build` nếu muốn build lại ảnh Docker).*
3. **Kiểm tra trạng thái Server:**
   ```bash
   docker ps
   ```
   *(Dùng để kiểm tra xem các container server đã chạy thành công hay chưa).*
4. Truy cập ứng dụng tại:
   * Giao diện WebAtlas: `http://localhost`
   * Dịch vụ MapServer: `http://localhost:8081/`
   * Cơ sở dữ liệu PostGIS: `localhost:5432` (`User: postgres` | `Pass: postgres` | `DB: gis`)

5. **Các lệnh quản lý Docker thường dùng:**
   * **Để Tắt MapServer:** Gõ lệnh `docker compose stop` (tạm dừng) hoặc `docker compose down` (tắt và xóa container hiện tại, không xóa dữ liệu của bạn).
   * **Để Khởi động lại (khi bạn sửa file cấu hình):** Gõ lệnh `docker compose restart`.

### Cách 2: Khởi chạy ở chế độ Phát triển (Dev Mode)
Yêu cầu đã cài **Node.js (v18+)**.

1. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
2. Chạy ứng dụng giao diện phát triển:
   ```bash
   npm run dev
   ```
3. Truy cập đường dẫn địa chỉ dev: `http://localhost:5173`

---

## 🧪 Các Lệnh Kiểm tra Code (Lint & Build)

* Kiểm tra lỗi cú pháp và linter:
  ```bash
  npm run lint
  ```
* Biển dịch TypeScript và đóng gói ứng dụng Production:
  ```bash
  npm run build
  ```
