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

export type {
  BasemapType,
  ReservoirFilterType,
  LayerState,
  PopupData,
  DamDetails,
  RelatedRivers,
  ChartDataItem,
  ExportReportOptions,
  LakeFeatureProps,
  LakeClassificationInfo
} from '../shared/types/map';
