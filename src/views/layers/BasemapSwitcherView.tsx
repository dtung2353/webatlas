/**
 * @file BasemapSwitcherView.tsx
 * @directory src/views/layers
 * @description View điều khiển chuyển đổi các lớp bản đồ nền (Basemap Switcher View Component).
 * 
 * Chức năng chính: Nút Chuyển đổi Bản đồ Nền (Basemap Switcher View)
 * Các chức năng nhỏ:
 * - Chuyển sang Bản đồ Đường phố (CartoDB Positron Light).
 * - Chuyển sang Bản đồ Vệ tinh (Esri World Imagery).
 * - Chuyển sang Bản đồ Địa hình (Esri World Hillshade DEM).
 */

import React from 'react';
import { useMapController } from '../../controllers/useMapController';
import type { BasemapType } from '../../models/mapTypes';
import { Map, Layers, Mountain } from 'lucide-react';

const BasemapSwitcherView: React.FC = () => {
  const { basemap, setBasemap } = useMapController();

  const options: { id: BasemapType; label: string; icon: React.ReactNode }[] = [
    { id: 'street', label: 'Đường phố', icon: <Map size={18} /> },
    { id: 'satellite', label: 'Vệ tinh', icon: <Layers size={18} /> },
    { id: 'dem', label: 'Địa hình', icon: <Mountain size={18} /> }
  ];

  return (
    <div className="basemap-switcher glass-panel">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setBasemap(opt.id)}
          className={`basemap-btn ${basemap === opt.id ? 'active' : ''}`}
          title={opt.label}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BasemapSwitcherView;
