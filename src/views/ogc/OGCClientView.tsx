/**
 * @file OGCClientView.tsx
 * @directory src/views/ogc
 * @description View tích hợp dữ liệu bản đồ WMS từ MapServer bên ngoài (OGC WMS Client View Component).
 * 
 * Chức năng chính: View Tích hợp Dữ liệu OGC MapServer WMS (OGC MapServer WMS Client View)
 * Các chức năng nhỏ:
 * - Nút kích hoạt Modal nạp WMS (Quả cầu Globe).
 * - Nhập địa chỉ WMS Server URL và Tên lớp dữ liệu (Layer Name).
 * - Khởi tạo WMS TileLayer gắn vào thể hiện bản đồ OpenLayers.
 */

import React, { useState } from 'react';
import { useMapController } from '../../controllers/useMapController';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { Globe, Plus, X } from 'lucide-react';
import { MAPSERVER_URL } from '../../models/appConfig';

const OGCClientView: React.FC = () => {
  const { map } = useMapController();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [layerName, setLayerName] = useState('');

  /** Thêm lớp WMS mới vào thể hiện bản đồ */
  const handleAddWMS = () => {
    if (!map || !url || !layerName) return;

    try {
      const wmsLayer = new TileLayer({
        source: new TileWMS({
          url: url,
          params: { 'LAYERS': layerName, 'TILED': true },
          serverType: 'mapserver',
          crossOrigin: 'anonymous',
        }),
        properties: { id: `wms_${Date.now()}` }
      });

      map.addLayer(wmsLayer);
      setIsOpen(false);
      setUrl('');
      setLayerName('');
      alert(`Đã nạp thành công lớp dữ liệu: ${layerName}`);
    } catch {
      alert('Lỗi khi nạp WMS URL. Vui lòng kiểm tra lại CORS hoặc URL.');
    }
  };

  return (
    <>
      <button 
        className="ogc-trigger-btn glass-panel"
        onClick={() => setIsOpen(true)}
        title="Nạp dữ liệu OGC (WMS)"
      >
        <Globe size={18} />
      </button>

      {isOpen && (
        <div className="ogc-modal-overlay">
          <div className="ogc-modal glass-panel">
            <div className="ogc-modal-header">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe size={18} className="text-blue-500" />
                Tích hợp dữ liệu OGC (MapServer WMS)
              </h3>
              <button onClick={() => setIsOpen(false)} className="close-btn"><X size={18} /></button>
            </div>
            
            <div className="ogc-modal-content">
              <div className="input-group">
                <label>WMS Server URL</label>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={MAPSERVER_URL} 
                />
              </div>
              <div className="input-group">
                <label>Tên Lớp (Layer Name)</label>
                <input 
                  type="text" 
                  value={layerName}
                  onChange={(e) => setLayerName(e.target.value)}
                  placeholder="diaphantinh, gadm41_vnm_3, thuyhe, thuydienvietnam" 
                />
              </div>
              <button className="add-layer-btn" onClick={handleAddWMS}>
                <Plus size={16} /> Nạp vào bản đồ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OGCClientView;
