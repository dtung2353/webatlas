/**
 * @file mapSnapshotModel.ts
 * @directory src/models
 * @description Model trích xuất và tổng hợp hình ảnh Canvas bản đồ từ OpenLayers Map Instance (Map Snapshot Model).
 * 
 * Chức năng chính: Model Chụp ảnh Canvas Bản đồ (OpenLayers Canvas Snapshot Model)
 * Các chức năng nhỏ:
 * - Kích hoạt vẽ đồng bộ `map.renderSync()`.
 * - Tổng hợp các lớp Canvas (WMS Tile Canvas, Vector Canvas, Basemap Tile Canvas).
 * - Áp dụng các ma trận biến đổi Transform và độ mờ Alpha tương ứng.
 * - Xuất ra chuỗi mã hóa hình ảnh Base64 PNG sắc nét phục vụ báo cáo.
 */

import { Map } from 'ol';

/**
 * Trích xuất ảnh chụp từ thể hiện OpenLayers Map dưới dạng chuỗi hình ảnh Base64 Data URL.
 * 
 * @param map Thể hiện bản đồ OpenLayers Map instance
 * @returns Promise chứa chuỗi Data URL hình ảnh (image/png)
 */
export const getMapSnapshot = (map: Map): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      map.once('rendercomplete', () => {
        const mapCanvas = document.createElement('canvas');
        const size = map.getSize();
        if (!size) {
          reject(new Error('Kích thước bản đồ không hợp lệ'));
          return;
        }

        mapCanvas.width = size[0];
        mapCanvas.height = size[1];
        const mapContext = mapCanvas.getContext('2d');
        if (!mapContext) {
          reject(new Error('Không thể khởi tạo Canvas 2D context'));
          return;
        }

        // Tô nền trắng chuẩn cho ảnh xuất
        mapContext.fillStyle = '#ffffff';
        mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

        // Lấy tất cả các phần tử canvas của OpenLayers layers
        const viewport = map.getViewport();
        const canvases = viewport.querySelectorAll<HTMLCanvasElement>('.ol-layer canvas, canvas.ol-unselectable');

        canvases.forEach((canvas) => {
          if (canvas.width > 0 && canvas.height > 0) {
            const opacity = (canvas.parentNode as HTMLElement)?.style?.opacity || '';
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

            const transform = canvas.style.transform;
            let matrix: number[] = [1, 0, 0, 1, 0, 0];

            if (transform) {
              const match = transform.match(/^matrix\((.*)\)$/);
              if (match) {
                matrix = match[1].split(',').map(Number);
              }
            }

            mapContext.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
            mapContext.drawImage(canvas, 0, 0);
          }
        });

        // Reset transform & alpha
        mapContext.setTransform(1, 0, 0, 1, 0, 0);
        mapContext.globalAlpha = 1.0;

        // Vẽ thêm khung viền nét bản đồ
        mapContext.strokeStyle = '#cbd5e1';
        mapContext.lineWidth = 2;
        mapContext.strokeRect(0, 0, mapCanvas.width, mapCanvas.height);

        resolve(mapCanvas.toDataURL('image/png'));
      });

      // Ép bản đồ vẽ lại đồng bộ để kích hoạt rendercomplete
      map.renderSync();
    } catch (err) {
      reject(err);
    }
  });
};
