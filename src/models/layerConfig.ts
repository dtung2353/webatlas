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

export interface LayerItemConfig {
  /** Mã định danh độc nhất của lớp */
  id: string;
  /** Tên tiếng Việt hiển thị trên giao diện Cây Quản lý Lớp */
  name: string;
  /** Mặc định bật hay tắt khi mở ứng dụng */
  defaultVisible: boolean;
  /** Độ mờ mặc định (0.0 đến 1.0) */
  opacity: number;
}

export interface LayerGroupConfig {
  /** Mã định danh nhóm lớp */
  id: string;
  /** Tên nhóm lớp hiển thị */
  name: string;
  /** Danh sách các lớp thành viên thuộc nhóm */
  layers: LayerItemConfig[];
}

export const layerGroups: LayerGroupConfig[] = [
  {
    id: 'group_admin',
    name: 'Ranh giới hành chính',
    layers: [
      { id: 'layer_provinces_2026', name: 'Ranh giới Tỉnh', defaultVisible: true, opacity: 1 },
      { id: 'layer_wards_2026', name: 'Ranh giới Xã/Phường', defaultVisible: true, opacity: 1 }
    ]
  },
  {
    id: 'group_water_resources',
    name: 'Tài nguyên nước',
    layers: [
      { id: 'layer_dams', name: 'Đập & Hồ chứa', defaultVisible: true, opacity: 1 },
      { id: 'layer_rivers', name: 'Mạng lưới sông ngòi', defaultVisible: true, opacity: 0.8 },
      { id: 'layer_stations', name: 'Trạm quan trắc', defaultVisible: false, opacity: 1 }
    ]
  },
  {
    id: 'group_hazards',
    name: 'Hiểm họa',
    layers: [
      { id: 'layer_flood', name: 'Vùng ngập lụt', defaultVisible: false, opacity: 0.6 },
      { id: 'layer_drought_survey', name: 'Vùng hạn hán', defaultVisible: false, opacity: 0.7 },
      { id: 'layer_saltwater_intrusion', name: 'Xâm nhập mặn', defaultVisible: false, opacity: 0.7 },
      { id: 'layer_flood_generation', name: 'Vùng sinh lũ', defaultVisible: false, opacity: 0.7 }
    ]
  }
];
