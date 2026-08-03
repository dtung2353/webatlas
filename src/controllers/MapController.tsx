/**
 * @file MapController.tsx
 * @directory src/controllers
 * @description Bộ điều khiển Trung tâm (Map Controller) quản lý trạng thái bản đồ, danh mục các lớp, bộ lọc đập hồ chứa và dữ liệu popup toàn ứng dụng.
 * 
 * Chức năng chính: Bộ Điều khiển Trạng thái Bản đồ Toàn cục (Central Map Controller & State Provider)
 * Các chức năng nhỏ:
 * - MapProvider: Context Provider bọc quanh ứng dụng React để cấp quyền điều khiển bản đồ.
 * - Quản lý thể hiện OpenLayers Map instance.
 * - Quản lý loại bản đồ nền Basemap (Vệ tinh, Đường phố, Địa hình).
 * - Bật/tắt hiển thị và điều chỉnh độ mờ opacity từng lớp bản đồ.
 * - Quản lý bộ lọc trạng thái đập thủy điện (Tất cả, Bình thường, Xả lũ, Nguy hiểm).
 * - Quản lý đối tượng popup được chọn và sông/lưu vực được phát sáng (highlight).
 */

import React, { createContext, useState, type ReactNode } from 'react';
import { Map } from 'ol';
import { layerGroups } from '../models/layerConfig';
import type { 
  BasemapType, 
  ReservoirFilterType, 
  LayerState, 
  PopupData 
} from '../models/mapTypes';

export type { BasemapType, ReservoirFilterType, LayerState, PopupData };

export interface MapControllerType {
  /** Thể hiện bản đồ OpenLayers */
  map: Map | null;
  setMap: (map: Map | null) => void;
  /** Loại bản đồ nền đang chọn */
  basemap: BasemapType;
  setBasemap: (basemap: BasemapType) => void;
  /** Danh sách trạng thái hiển thị & opacity của từng lớp */
  layersState: LayerState[];
  toggleLayerVisibility: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  /** Bộ lọc trạng thái đập & hồ chứa */
  reservoirFilter: ReservoirFilterType;
  setReservoirFilter: (filter: ReservoirFilterType) => void;
  /** Dữ liệu điểm được chọn hiển thị popup */
  popupData: PopupData | null;
  setPopupData: (data: PopupData | null) => void;
  /** Tên lưu vực sông đang được nổi bật (highlight) */
  highlightedRiverBasin: string | null;
  setHighlightedRiverBasin: (basin: string | null) => void;
}

export const MapContext = createContext<MapControllerType | undefined>(undefined);

/**
 * Controller Provider bọc quanh ứng dụng để phân phối dữ liệu bản đồ và phương thức điều khiển.
 */
export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<Map | null>(null);
  const [basemap, setBasemap] = useState<BasemapType>('street');
  const [reservoirFilter, setReservoirFilter] = useState<ReservoirFilterType>('all');
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [highlightedRiverBasin, setHighlightedRiverBasin] = useState<string | null>(null);
  
  // Khởi tạo trạng thái lớp dữ liệu dựa trên cấu hình layerGroups
  const initialLayersState: LayerState[] = [];
  layerGroups.forEach(group => {
    group.layers.forEach(layer => {
      initialLayersState.push({
        id: layer.id,
        visible: layer.defaultVisible,
        opacity: layer.opacity
      });
    });
  });

  const [layersState, setLayersState] = useState<LayerState[]>(initialLayersState);

  /** Chuyển đổi trạng thái bật/tắt của 1 lớp */
  const toggleLayerVisibility = (layerId: string) => {
    setLayersState(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  /** Chỉnh sửa độ mờ (opacity) của 1 lớp */
  const setLayerOpacity = (layerId: string, opacity: number) => {
    setLayersState(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  return (
    <MapContext.Provider value={{
      map, setMap,
      basemap, setBasemap,
      layersState, toggleLayerVisibility, setLayerOpacity,
      reservoirFilter, setReservoirFilter,
      popupData, setPopupData,
      highlightedRiverBasin, setHighlightedRiverBasin
    }}>
      {children}
    </MapContext.Provider>
  );
};
