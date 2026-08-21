/**
 * @file MapControlsView.tsx
 * @directory src/views/map
 * @description View điều khiển ở góc trên bên phải bao gồm các nút xếp theo phương từ trên xuống: Tăng kích cỡ, Giảm kích cỡ, Vị trí hiện tại, Thao tác bản đồ.
 */

import React, { useState, useEffect } from 'react';
import { useMapController } from '../../controllers/useMapController';
import { ZoomIn, ZoomOut, Ruler, Square, MousePointer2, Home, Sliders, Layers } from 'lucide-react';
import { fromLonLat } from 'ol/proj';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { getLength, getArea } from 'ol/sphere';
import { unByKey } from 'ol/Observable';

const MapControlsView: React.FC = () => {
  const { map, basemap, setBasemap } = useMapController();
  const [activeTool, setActiveTool] = useState<'pan' | 'length' | 'area'>('pan');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [measureValue, setMeasureValue] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(7);
  const [minZoom, setMinZoom] = useState<number>(6);
  const [maxZoom, setMaxZoom] = useState<number>(18);
  const [isLocating, setIsLocating] = useState(false);

  // Cập nhật mức zoom hiện tại
  useEffect(() => {
    if (!map) return;

    const view = map.getView();
    setCurrentZoom(view.getZoom() || 7);
    setMinZoom(view.getMinZoom() || 6);
    setMaxZoom(view.getMaxZoom() || 18);

    const handleMoveEnd = () => {
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        setCurrentZoom(zoom);
      }
    };

    map.on('moveend', handleMoveEnd);
    return () => {
      map.un('moveend', handleMoveEnd);
    };
  }, [map]);

  // Quản lý công cụ đo đạc (Đo độ dài & Đo diện tích)
  useEffect(() => {
    if (!map) return;

    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(59, 130, 246, 0.25)',
        'stroke-color': '#2563eb',
        'stroke-width': 2.5,
        'circle-radius': 6,
        'circle-fill-color': '#2563eb',
      },
      zIndex: 999
    });
    map.addLayer(vector);

    let draw: Draw | null = null;

    if (activeTool !== 'pan') {
      const type = activeTool === 'length' ? 'LineString' : 'Polygon';
      draw = new Draw({
        source: source,
        type: type,
      });

      let listener: any;
      draw.on('drawstart', (e) => {
        source.clear();
        setMeasureValue(null);
        
        const sketch = e.feature;
        listener = sketch.getGeometry()?.on('change', (evt) => {
          const geom = evt.target;
          if (geom.getType() === 'LineString') {
            const length = getLength(geom);
            const output = length > 100 ? (Math.round((length / 1000) * 100) / 100) + ' km' : (Math.round(length * 100) / 100) + ' m';
            setMeasureValue(`Đang đo: ${output}`);
          } else if (geom.getType() === 'Polygon') {
            const area = getArea(geom);
            const output = area > 10000 ? (Math.round((area / 1000000) * 100) / 100) + ' km²' : (Math.round(area * 100) / 100) + ' m²';
            setMeasureValue(`Đang đo: ${output}`);
          }
        });
      });

      draw.on('drawend', (e) => {
        const geom = e.feature.getGeometry();
        if (!geom) return;

        if (geom.getType() === 'LineString') {
          const length = getLength(geom);
          const output = length > 100 ? (Math.round((length / 1000) * 100) / 100) + ' km' : (Math.round(length * 100) / 100) + ' m';
          setMeasureValue(`Chiều dài: ${output}`);
        } else if (geom.getType() === 'Polygon') {
          const area = getArea(geom);
          const output = area > 10000 ? (Math.round((area / 1000000) * 100) / 100) + ' km²' : (Math.round(area * 100) / 100) + ' m²';
          setMeasureValue(`Diện tích: ${output}`);
        }
        
        if (listener) {
          unByKey(listener);
        }
      });

      map.addInteraction(draw);
    }

    return () => {
      map.removeLayer(vector);
      if (draw) {
        map.removeInteraction(draw);
      }
    };
  }, [map, activeTool]);

  const isMinZoom = currentZoom <= minZoom + 0.05;
  const isMaxZoom = currentZoom >= maxZoom - 0.05;

  const handleZoomIn = () => {
    if (!map) return;
    const view = map.getView();
    const current = view.getZoom() || 0;
    if (current < maxZoom) {
      view.animate({ zoom: Math.min(maxZoom, current + 1), duration: 250 });
    }
  };

  const handleZoomOut = () => {
    if (!map) return;
    const view = map.getView();
    const current = view.getZoom() || 0;
    if (current > minZoom) {
      view.animate({ zoom: Math.max(minZoom, current - 1), duration: 250 });
    }
  };

  // Định vị trí hiện tại
  const handleCurrentLocation = () => {
    if (!map) return;
    setIsLocating(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.longitude, position.coords.latitude];
          const olCoords = fromLonLat(coords);
          
          map.getView().animate({
            center: olCoords,
            zoom: 13,
            duration: 1000
          });
          setIsLocating(false);
        },
        (error) => {
          console.warn('Geolocation failed, fallback to region home', error);
          map.getView().animate({ center: fromLonLat([108.2, 13.5]), zoom: 9, duration: 800 });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      map.getView().animate({ center: fromLonLat([108.2, 13.5]), zoom: 9, duration: 800 });
      setIsLocating(false);
    }
  };

  const handleHome = () => {
    map?.getView().animate({ center: fromLonLat([108.2, 13.5]), zoom: 7, duration: 500 });
    setShowToolsMenu(false);
  };

  return (
    <div className="top-right-map-controls flex flex-col items-end">
      {/* Thanh nút bấm điều khiển xếp theo phương dọc từ trên xuống */}
      <div 
        className="glass-panel main-control-group" 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px' }}
      >
        {/* 1. Tăng kích cỡ */}
        <button 
          className={`control-btn ${isMaxZoom ? 'disabled' : ''}`} 
          onClick={handleZoomIn} 
          disabled={isMaxZoom}
          title="Tăng kích cỡ (Phóng to)"
        >
          <ZoomIn size={18} />
        </button>

        {/* 2. Giảm kích cỡ */}
        <button 
          className={`control-btn ${isMinZoom ? 'disabled' : ''}`} 
          onClick={handleZoomOut} 
          disabled={isMinZoom}
          title="Giảm kích cỡ (Thu nhỏ)"
        >
          <ZoomOut size={18} />
        </button>

        <div className="btn-divider" style={{ width: '20px', height: '1px', margin: '2px 0', background: 'rgba(0,0,0,0.1)' }} />

        {/* 3. Vị trí hiện tại */}
        <button 
          className={`control-btn ${isLocating ? 'animate-pulse text-blue-500' : ''}`} 
          onClick={handleCurrentLocation}
          title="Vị trí hiện tại (Định vị GPS)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </button>

        <div className="btn-divider" style={{ width: '20px', height: '1px', margin: '2px 0', background: 'rgba(0,0,0,0.1)' }} />

        {/* 4. Thao tác bản đồ */}
        <button 
          className={`control-btn ${showToolsMenu || activeTool !== 'pan' ? 'active' : ''}`}
          onClick={() => setShowToolsMenu(!showToolsMenu)}
          title="Thao tác bản đồ (Công cụ đo đạc, điều khiển & Bản đồ nền)"
        >
          <Sliders size={18} />
        </button>
      </div>

      {/* Menu thả xuống Thao tác bản đồ hiển thị bên cạnh menu đứng từ trên xuống */}
      {showToolsMenu && (
        <div className="tools-dropdown-menu glass-panel animate-slide-down">
          <div className="menu-title">Công cụ tương tác</div>
          
          <button 
            className={`menu-item ${activeTool === 'pan' ? 'active' : ''}`}
            onClick={() => { setActiveTool('pan'); setMeasureValue(null); setShowToolsMenu(false); }}
          >
            <MousePointer2 size={16} />
            <span>Di chuyển (Pan Mode)</span>
          </button>

          <button 
            className={`menu-item ${activeTool === 'length' ? 'active' : ''}`}
            onClick={() => { setActiveTool('length'); setMeasureValue(null); setShowToolsMenu(false); }}
          >
            <Ruler size={16} />
            <span>Đo chiều dài đường / sông</span>
          </button>

          <button 
            className={`menu-item ${activeTool === 'area' ? 'active' : ''}`}
            onClick={() => { setActiveTool('area'); setMeasureValue(null); setShowToolsMenu(false); }}
          >
            <Square size={16} />
            <span>Đo diện tích vùng ngập</span>
          </button>

          <button className="menu-item" onClick={handleHome}>
            <Home size={16} />
            <span>Góc nhìn toàn cảnh Nam Trung Bộ</span>
          </button>

          <div className="my-1 border-t border-gray-200/50" />

          {/* Chức năng Lớp Bản đồ nền */}
          <div className="menu-title">Lớp bản đồ nền</div>

          <button 
            className={`menu-item ${basemap === 'street' ? 'active' : ''}`}
            onClick={() => { setBasemap('street'); setShowToolsMenu(false); }}
          >
            <Layers size={16} className="text-blue-500" />
            <span>Bản đồ Đường phố</span>
          </button>

          <button 
            className={`menu-item ${basemap === 'satellite' ? 'active' : ''}`}
            onClick={() => { setBasemap('satellite'); setShowToolsMenu(false); }}
          >
            <Layers size={16} className="text-emerald-500" />
            <span>Bản đồ Vệ tinh</span>
          </button>

          <button 
            className={`menu-item ${basemap === 'dem' ? 'active' : ''}`}
            onClick={() => { setBasemap('dem'); setShowToolsMenu(false); }}
          >
            <Layers size={16} className="text-amber-500" />
            <span>Bản đồ Địa hình (DEM)</span>
          </button>
        </div>
      )}

      {/* Kết quả / Hướng dẫn đo đạc */}
      {activeTool !== 'pan' && !measureValue && (
        <div className="measure-result-info glass-panel">
          Nhấp chuột trên bản đồ để bắt đầu đo. Nhấp đúp để kết thúc.
        </div>
      )}

      {measureValue && (
        <div className="measure-result-info glass-panel text-blue-700 font-semibold">
          {measureValue}
        </div>
      )}
    </div>
  );
};

export default MapControlsView;
