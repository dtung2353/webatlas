/**
 * @file gmlParser.ts
 * @directory src/models
 * @description Model phân tích và chuyển đổi dữ liệu không gian định dạng GML (Geography Markup Language) thành mảng tọa độ OpenLayers.
 * 
 * Chức năng chính: Model Phân tích Cú pháp GML (GML Spatial Data Parser Model)
 * Các chức năng nhỏ:
 * - parseGMLCoordinates: Chuyển đổi chuỗi tọa độ GML ("lon,lat lon,lat") thành mảng các cặp tọa độ OpenLayers Projection [x, y] EPSG:3857.
 */

import { fromLonLat } from 'ol/proj';

/**
 * Phân tích chuỗi tọa độ GML dạng "lon,lat lon,lat ..." thành mảng các cặp tọa độ chuẩn OpenLayers EPSG:3857 [x, y].
 * 
 * @param coordsStr Chuỗi tọa độ GML thu được từ MapServer WFS (VD: "108.5,13.2 108.6,13.3")
 * @returns Mảng các cặp tọa độ EPSG:3857 [[x1, y1], [x2, y2], ...]
 */
export function parseGMLCoordinates(coordsStr: string): number[][] {
  const points: number[][] = [];
  const pairs = coordsStr.trim().split(/\s+/);
  
  for (const pair of pairs) {
    const parts = pair.split(',');
    if (parts.length >= 2) {
      const lon = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lon) && !isNaN(lat)) {
        points.push(fromLonLat([lon, lat]));
      }
    }
  }
  
  return points;
}
