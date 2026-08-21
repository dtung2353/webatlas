/**
 * @file App.tsx
 * @directory src
 * @description Thành phần Root Layout chính cho ứng dụng WebAtlas định vị các khu vực giao diện màn hình chuẩn xác.
 */

import { MapProvider } from './controllers/MapController';
import MapView from './views/map/MapView';
import MapControlsView from './views/map/MapControlsView';
import SearchBarView from './views/search/SearchBarView';
import DynamicPopupView from './views/popup/DynamicPopupView';
import DynamicLegendView from './views/popup/DynamicLegendView';
import LoginModalView from './views/auth/LoginModalView';
import FeatureDockView from './views/features/FeatureDockView';
import './styles/main.css';

function App() {
  return (
    <MapProvider>
      <div className="app-container">
        {/* Khung bản đồ chính OpenLayers (View) */}
        <MapView />

        {/* 1. GÓC TRÊN BÊN TRÁI: Nút ẩn/hiện chú thích bản đồ */}
        <div className="layout-top-left flex flex-col gap-2">
          <DynamicLegendView />
        </div>

        {/* 2. TRUNG TÂM BÊN TRÊN: Thanh tìm kiếm & Chức năng Lọc bên cạnh */}
        <div className="layout-top-center">
          <SearchBarView />
        </div>

        {/* 3. GÓC TRÊN BÊN PHẢI: Nút Đăng nhập & Điều khiển bản đồ */}
        <div className="layout-top-right flex flex-col items-end gap-2.5">
          <LoginModalView />
          <MapControlsView />
        </div>

        {/* 4. GÓC DƯỚI BÊN PHẢI: Nút ẩn các chức năng & Thanh hiển thị 7 chức năng xếp dọc */}
        <div className="layout-bottom-right">
          <FeatureDockView />
        </div>

        {/* Cửa sổ Popup hiển thị thông tin đối tượng click (View) */}
        <DynamicPopupView />
      </div>
    </MapProvider>
  );
}

export { App as default };
