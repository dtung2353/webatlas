/**
 * @file layerConfig.ts
 * @directory src/models
 * @description Model cấu hình danh mục nhóm lớp bản đồ và các lớp dữ liệu không gian hiển thị trên WebAtlas.
 * 
 * Chức năng chính: Model Cấu hình Cây Nhóm Lớp Bản đồ (Map Layer Group Configuration Model)
 * Các chức năng nhỏ:
 * - LayerItemConfig: Cấu hình lớp bản đồ đơn lẻ (Id, Tên, Ẩn/Hiện mặc định, Độ mờ mặc định).
 * - LayerGroupConfig: Định nghĩa nhóm danh mục (Ranh giới hành chính, Tài nguyên nước, Hiểm họa).
 * - layerGroups: Danh mục nhóm lớp mặc định ứng dụng.
 */

export { layerGroups } from '../shared/config/layerConfig';
export type { LayerItemConfig, LayerGroupConfig } from '../shared/config/layerConfig';
