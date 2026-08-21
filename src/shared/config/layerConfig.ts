/**
 * @file layerConfig.ts
 * @directory src/shared/config
 * @description Model định nghĩa danh mục các nhóm lớp bản đồ không gian OGC WMS MapServer (Map Layer Groups Configuration).
 * 
 * Kiến trúc MVC: Model (Layer Configuration & Metadata System)
 * Các nhóm lớp chính:
 * 1. Ranh giới hành chính: Ranh giới Tỉnh & Xã/Phường Nam Trung Bộ & Tây Nguyên (PostGIS / MapServer WMS).
 * 2. Tài nguyên nước: Hệ thống Hồ chứa & Đập Thủy điện, Mạng lưới Sông ngòi, Trạm quan trắc thủy văn real-time.
 * 3. Hiểm họa thiên tai: Bản đồ phân vùng Ngập lụt, Hạn hán, Xâm nhập mặn, Vùng sinh lũ thượng nguồn.
 */

export interface LayerItemConfig {
  id: string;
  name: string;
  defaultVisible: boolean;
  opacity: number;
}

export interface LayerGroupConfig {
  id: string;
  name: string;
  layers: LayerItemConfig[];
}

export const layerGroups: LayerGroupConfig[] = [
  {
    id: 'group_admin',
    name: 'Ranh giới hành chính',
    layers: [
      { id: 'layer_provinces_2026', name: 'Ranh giới Tỉnh/Thành', defaultVisible: true, opacity: 1 },
      { id: 'layer_wards_2026', name: 'Ranh giới Xã/Phường', defaultVisible: false, opacity: 1 }
    ]
  },
  {
    id: 'group_water_resources',
    name: 'Tài nguyên nước',
    layers: [
      { id: 'layer_lakes', name: 'Hồ & Mặt nước', defaultVisible: true, opacity: 0.85 },
      { id: 'layer_dams', name: 'Đập & Hồ chứa', defaultVisible: true, opacity: 1 },
      { id: 'layer_rivers', name: 'Mạng lưới sông ngòi', defaultVisible: true, opacity: 0.8 },
      { id: 'layer_stations', name: 'Trạm quan trắc', defaultVisible: false, opacity: 1 }
    ]
  },
  {
    id: 'group_infrastructure',
    name: 'Hạ tầng & Dân sinh',
    layers: [
      { id: 'layer_roads', name: 'Giao thông đường bộ', defaultVisible: true, opacity: 0.85 },
      { id: 'layer_railways', name: 'Đường sắt Việt Nam', defaultVisible: true, opacity: 0.9 },
      { id: 'layer_residential', name: 'Địa điểm dân cư & Đô thị', defaultVisible: true, opacity: 1 }
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
