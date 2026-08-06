/**
 * @file App.tsx
 * @directory src
 * @description Thành phần Root Layout chính cho ứng dụng WebAtlas kết nối Controller và các Views theo mô hình MVC.
 * 
 * Chức năng chính: Khung Giao diện Ứng dụng Chính (MVC Root Layout Container)
 * Các chức năng nhỏ:
 * - Bao bọc toàn bộ ứng dụng trong `MapProvider` (Controller trung tâm).
 * - Kết nối các Views chính: MapView, MapControlsView, LayerTreeView, BasemapSwitcherView, SearchBarView, DynamicLegendView, OGCClientView, PDFExportButtonView, DynamicPopupView.
 * - Nút bật/tắt hiển thị ẩn các bảng giao diện (Toggle UI panels visibility).
 */

import { useState } from 'react';
import { MapProvider } from './controllers/MapController';
import MapView from './views/map/MapView';
import BasemapSwitcherView from './views/layers/BasemapSwitcherView';
import LayerTreeView from './views/layers/LayerTreeView';
import MapControlsView from './views/map/MapControlsView';
import SearchBarView from './views/search/SearchBarView';
import DynamicPopupView from './views/popup/DynamicPopupView';
import DynamicLegendView from './views/popup/DynamicLegendView';
import OGCClientView from './views/ogc/OGCClientView';
import PDFExportButtonView from './views/export/PDFExportButtonView';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import './styles/main.css';

function App() {
  const [panelsVisible, setPanelsVisible] = useState(true);

  return (
    <MapProvider>
      <div className="app-container">
        {/* Khung bản đồ chính OpenLayers (View) */}
        <MapView />

        {/* Thanh công cụ tương tác bản đồ (View) */}
        <MapControlsView />

        {/* Các bảng quản lý giao diện có thể ẩn/hiện (Views) */}
        <div className={`panels-wrapper ${panelsVisible ? '' : 'hidden'}`}>
          <LayerTreeView />
          <BasemapSwitcherView />
          <SearchBarView />
          <DynamicLegendView />
          <OGCClientView />
          <PDFExportButtonView />
        </div>

        {/* Cửa sổ Popup hiển thị thông tin đối tượng click (View) */}
        <DynamicPopupView />

        {/* Nút ẩn/hiện giao diện các panel */}
        <button
          className="toggle-panels-btn glass-panel"
          onClick={() => setPanelsVisible(!panelsVisible)}
          title={panelsVisible ? 'Ẩn các panel' : 'Hiện các panel'}
        >
          {panelsVisible ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          <span>{panelsVisible ? 'Ẩn giao diện' : 'Hiện giao diện'}</span>
        </button>
      </div>
    </MapProvider>
  );
}

export { App as default };
