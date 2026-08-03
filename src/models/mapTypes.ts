/**
 * @file mapTypes.ts
 * @directory src/models
 * @description Model định nghĩa các giao diện dữ liệu (Interfaces) và kiểu dữ liệu (Types) toàn cục cho ứng dụng WebAtlas.
 * 
 * Chức năng chính: Kiểu Dữ liệu Bản đồ & Đối tượng GIS (Global GIS Data Model Types)
 * Các chức năng nhỏ:
 * - BasemapType: Kiểu bản đồ nền (Đường phố, Vệ tinh, Địa hình DEM).
 * - ReservoirFilterType: Lọc trạng thái đập thủy điện (Tất cả, Bình thường, Xả lũ, Nguy hiểm).
 * - LayerState: Trạng thái hiển thị và độ mờ opacity của từng lớp.
 * - PopupData: Tọa độ click và thuộc tính đối tượng GIS.
 * - DamDetails: Thuộc tính kỹ thuật chi tiết đập thủy điện.
 * - RelatedRivers: Lưu vực sông và danh sách sông phụ lưu liên quan.
 * - ChartDataItem: Dữ liệu phần tử biểu đồ thống kê.
 * - ExportReportOptions: Tùy chọn tiêu đề, tác giả, ghi chú khi xuất báo cáo PDF.
 */

export type BasemapType = 'satellite' | 'street' | 'dem';

export type ReservoirFilterType = 'all' | 'binh_thuong' | 'xa_lu' | 'nguy_hiem';

export interface LayerState {
  /** Mã định danh độc nhất của lớp */
  id: string;
  /** Bật/tắt ẩn hiện lớp trên bản đồ */
  visible: boolean;
  /** Độ mờ của lớp (từ 0.0 đến 1.0) */
  opacity: number;
}

export interface PopupData {
  /** Tọa độ hiển thị popup trên bản đồ [x, y] (EPSG:3857) */
  coordinate: number[];
  /** Đối tượng chứa các thuộc tính địa lý (Properties) */
  feature: any;
}

export interface DamDetails {
  /** Tên đập / công trình */
  ten: string;
  /** Loại đập (Đập chính / Đập phụ) */
  loai: string;
  /** Loại vật liệu xây dựng đập */
  vatLieu: string;
  /** Cấp công trình (Cấp I, II, III, Đặc biệt) */
  capCongTrinh: string;
  /** Cao trình đỉnh đập (m) */
  caoTrinhDinh: string;
  /** Cao trình tường chắn sóng (m) */
  caoTrinhTuongChan: string;
  /** Chiều dài đỉnh đập (m) */
  chieuDai: string;
  /** Chiều cao lớn nhất (m) */
  chieuCaoMax: string;
  /** Chiều rộng đỉnh đập (m) */
  chieuRongDinh: string;
  /** Tình trạng mái thượng lưu */
  maiThuongLuu: string;
  /** Tình trạng thấm nước nặng */
  thamNang: string;
  /** Tình trạng thấm nước nhẹ */
  thamNhe: string;
}

export interface RelatedRivers {
  /** Tên lưu vực sông */
  basin: string;
  /** Tên sông chính (nếu là nhánh) */
  mainRiver: string | null;
  /** Danh sách các sông nhánh phụ lưu */
  branches: string[];
}

export interface ChartDataItem {
  /** Nhãn hiển thị của mục thống kê */
  label: string;
  /** Giá trị số lượng */
  value: number;
  /** Mã màu Hex hiển thị */
  color: string;
}

export interface ExportReportOptions {
  /** Tiêu đề báo cáo */
  title?: string;
  /** Tên tác giả / Đơn vị phát hành */
  author?: string;
  /** Ghi chú bổ sung */
  notes?: string;
}
