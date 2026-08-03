/**
 * @file useMapController.ts
 * @directory src/controllers
 * @description Custom React Hook đóng vai trò giao tiếp giữa các View và Controller trung tâm (MapController).
 * 
 * Chức năng chính: Controller Custom Hook (View-to-Controller Bridge Hook)
 * Các chức năng nhỏ:
 * - Truy cập an toàn vào MapContext.
 * - Cung cấp trạng thái bản đồ và các hàm điều khiển cho View.
 */

import { useContext } from 'react';
import { MapContext, type MapControllerType } from './MapController';

/**
 * Hook giúp các View dễ dàng truy cập và gọi các phương thức hành động từ MapController.
 * 
 * @returns Đối tượng MapControllerType chứa các state và hàm xử lý của bản đồ
 */
export const useMapController = (): MapControllerType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapController phải được sử dụng bên trong MapProvider');
  }
  return context;
};
