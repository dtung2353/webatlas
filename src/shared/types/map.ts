/**
 * @file map.ts
 * @directory src/shared/types
 * @description Model định nghĩa toàn bộ Typescript Interfaces & Data Types cốt lõi cho ứng dụng WebAtlas.
 * 
 * Kiến trúc MVC: Model (Data Schemas & Type System)
 * Các chức năng chính:
 * - BasemapType: Định nghĩa 3 lớp bản đồ nền (Đường phố, Vệ tinh, Địa hình DEM).
 * - ReservoirFilterType: Bộ lọc trạng thái vận hành đập thủy điện (Tất cả, Bình thường, Xả lũ, Cảnh báo nguy hiểm).
 * - LayerState: Trạng thái bật/tắt (visible) và độ trong suốt (opacity 0.0 - 1.0) của từng lớp bản đồ MapServer OGC WMS.
 * - PopupData: Tọa độ click trên bản đồ và thông tin thuộc tính GeoJSON/GML của đối tượng thủy văn.
 * - DamDetails: Thông số kỹ thuật xây dựng đập (Chiều cao max, chiều dài đỉnh đập, cao trình, vật liệu đập).
 * - RelatedRivers: Mạng lưới lưu vực sông và các sông phụ lưu liên quan.
 * - ChartDataItem: Mô hình dữ liệu đầu vào cho biểu đồ thống kê dung tích & lưu lượng hồ đập.
 * - ExportReportOptions: Tùy chọn cấu hình tiêu đề, tác giả, ghi chú khi xuất file Báo cáo PDF.
 */

export type BasemapType = 'satellite' | 'street' | 'dem';

export type ReservoirFilterType = 'all' | 'binh_thuong' | 'xa_lu' | 'nguy_hiem';

export interface LayerState {
  id: string;
  visible: boolean;
  opacity: number;
}

export interface PopupData {
  coordinate: number[];
  feature: any;
}

export interface DamDetails {
  ten: string;
  loai: string;
  vatLieu: string;
  capCongTrinh: string;
  caoTrinhDinh: string;
  caoTrinhTuongChan: string;
  chieuDai: string;
  chieuCaoMax: string;
  chieuRongDinh: string;
  maiThuongLuu: string;
  thamNang: string;
  thamNhe: string;
}

export interface RelatedRivers {
  basin: string;
  mainRiver: string | null;
  branches: string[];
}

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

export interface ExportReportOptions {
  title?: string;
  author?: string;
  notes?: string;
}

export type { LakeFeatureProps, LakeClassificationInfo } from '../../models/lakeModel';
