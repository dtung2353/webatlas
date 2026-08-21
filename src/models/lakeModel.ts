/**
 * @file lakeModel.ts
 * @directory src/models
 * @description Model nghiệp vụ xử lý dữ liệu và phân loại hồ mặt nước, vùng nước tự nhiên & hồ chứa thủy lợi (Lake & Water Surface Model).
 * 
 * Kiến trúc MVC: Model (Domain Data & Business Logic Layer)
 * 
 * Các chức năng chính:
 * 1. Định nghĩa kiểu dữ liệu thuộc tính hồ mặt nước (LakeFeatureProps).
 * 2. Từ điển phân loại thủy vực (fclass) sang tiếng Việt kèm mô tả công năng sinh thái.
 * 3. Đánh giá chức năng khai thác thủy lợi / điều tiết / cảnh quan môi trường.
 * 4. Tiện ích điều hướng không gian (Zoom to Lake Extent) trên bản đồ OpenLayers.
 */

import { Map } from 'ol';
import { transformExtent } from 'ol/proj';

export interface LakeFeatureProps {
  fid?: number | string;
  osm_id?: string | number;
  code?: number;
  fclass?: string;
  name?: string;
  Ten?: string;
  ten?: string;
  Vietnamese?: string;
  boundedBy?: string | number[];
  geometry?: any;
  _layerName?: string;
}

export interface LakeClassificationInfo {
  label: string;
  category: string;
  desc: string;
  functions: string[];
  color: string;
}

/**
 * Bản đồ tra cứu phân loại mặt nước và chức năng sinh thái thủy văn
 */
export const LAKE_CLASSIFICATION_MAP: Record<string, LakeClassificationInfo> = {
  water: {
    label: 'Hồ nước ngọt / Mặt nước tự nhiên',
    category: 'Mặt nước tự nhiên',
    desc: 'Mặt nước mở tự nhiên, điều hòa vi khí hậu & bảo vệ cảnh quan sinh thái',
    functions: ['Điều hòa vi khí hậu', 'Bảo tồn đa dạng sinh học', 'Cảnh quan & Du lịch'],
    color: '#0284c7'
  },
  reservoir: {
    label: 'Hồ chứa nước nhân tạo / Thủy lợi',
    category: 'Hồ chứa nhân tạo',
    desc: 'Công trình hồ chứa tích trữ nước phục vụ thủy lợi, cấp nước sinh hoạt & cắt lũ',
    functions: ['Tích trữ nguồn nước', 'Cắt giảm đỉnh lũ', 'Cấp nước tưới tiêu nông nghiệp'],
    color: '#0369a1'
  },
  riverbank: {
    label: 'Vùng bãi bồi / Lòng sông mở rộng',
    category: 'Thủy hệ sông',
    desc: 'Khu vực bãi bồi và dòng chảy lòng sông tự nhiên',
    functions: ['Thoát lũ', 'Giao thông thủy', 'Bồi tụ phù sa'],
    color: '#0ea5e9'
  },
  wetland: {
    label: 'Vùng đất ngập nước',
    category: 'Đất ngập nước',
    desc: 'Hệ sinh thái đất ngập nước nội địa, duy trì nguồn nước ngầm',
    functions: ['Lọc sạch nước tự nhiên', 'Nuôi dưỡng nước ngầm', 'Hệ sinh thái nhạy cảm'],
    color: '#059669'
  },
  wetland_marsh: {
    label: 'Đầm lầy nước ngọt',
    category: 'Đầm lầy',
    desc: 'Đầm lầy ngập nước theo mùa, thảm thực vật thủy sinh phong phú',
    functions: ['Lưu trữ carbon sinh học', 'Giảm tốc dòng lũ'],
    color: '#10b981'
  },
  wetland_mangrove: {
    label: 'Rừng ngập mặn ven biển',
    category: 'Rừng ngập mặn',
    desc: 'Hệ sinh thái rừng ngập mặn bảo vệ đê điều và bờ biển khỏi xâm nhập mặn',
    functions: ['Chắn sóng & Chống xói lở bờ', 'Giảm xâm nhập mặn', 'Bảo tồn thủy sinh'],
    color: '#047857'
  },
  wetland_tidalflat: {
    label: 'Bãi triều ngập nước',
    category: 'Bãi triều',
    desc: 'Vùng bãi triều ven biển chịu ảnh hưởng của chế độ nhật triều/bán nhật triều',
    functions: ['Vùng đệm cửa sông ven biển', 'Nuôi trồng thủy hải sản'],
    color: '#0d9488'
  },
  dock: {
    label: 'Vụng bến thủy / Bến cảng',
    category: 'Công trình thủy',
    desc: 'Khu vực nước tĩnh phục vụ neo đậu tàu thuyền và bến bãi giao thông thủy',
    functions: ['Neo đậu tàu thuyền', 'Hạ tầng giao thông thủy'],
    color: '#475569'
  }
};

/**
 * Lấy thông tin phân loại chi tiết của hồ / mặt nước
 */
export function getLakeClassification(fclass?: string, _code?: number): LakeClassificationInfo {
  const normalizedKey = (fclass || 'water').toLowerCase();
  return LAKE_CLASSIFICATION_MAP[normalizedKey] || {
    label: 'Thủy vực / Mặt nước',
    category: 'Mặt nước',
    desc: 'Khu vực thủy văn bề mặt phục vụ quản lý tài nguyên nước',
    functions: ['Lưu trữ nước', 'Môi trường sinh thái'],
    color: '#0284c7'
  };
}

/**
 * Điều khiển OpenLayers phóng to bao quát khu vực hồ
 */
export function zoomToLake(map: Map | null, coordinate?: number[], boundedBy?: any): void {
  if (!map) return;
  const view = map.getView();

  // 1. Trường hợp có dữ liệu Bounding Box (gml:boundedBy / coordinates)
  if (Array.isArray(boundedBy) && boundedBy.length === 4) {
    try {
      const olExtent = transformExtent(boundedBy, 'EPSG:4326', 'EPSG:3857');
      view.fit(olExtent, {
        padding: [60, 60, 60, 60],
        duration: 800,
        maxZoom: 15
      });
      return;
    } catch {
      // Bỏ qua lỗi và chuyển sang zoom theo tọa độ
    }
  }

  // 2. Zoom theo tọa độ điểm nhấp chuột
  if (coordinate) {
    view.animate({
      center: coordinate,
      zoom: Math.max(view.getZoom() || 10, 13),
      duration: 600
    });
  }
}
