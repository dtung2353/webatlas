/**
 * @file LayerTreeView.tsx
 * @directory src/views/layers
 * @description View Cây danh mục lớp dữ liệu bản đồ (Layer Tree View Component).
 * 
 * Chức năng chính: Khung Cây Quản lý Danh mục Lớp Bản đồ (Layer Tree Panel View)
 * Các chức năng nhỏ:
 * - Mở rộng / thu gọn từng nhóm danh mục lớp (Ranh giới hành chính, Tài nguyên nước, Hiểm họa).
 * - Nút checkbox Bật / Tắt trạng thái hiển thị của từng lớp dữ liệu.
 * - Thanh trượt Slider thay đổi độ mờ opacity (từ 0.0 mờ hẳn đến 1.0 rõ nét) của các lớp đang hiển thị.
 */

import React, { useState } from 'react';
import { useMapController } from '../../controllers/useMapController';
import { layerGroups } from '../../models/layerConfig';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';

const LayerTreeView: React.FC = () => {
  const { layersState, toggleLayerVisibility, setLayerOpacity } = useMapController();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'group_water_resources': true,
    'group_infrastructure': true,
    'group_admin': true
  });

  /** Mở rộng hoặc thu gọn 1 nhóm lớp */
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="layer-tree glass-panel">
      <div className="layer-tree-header">
        <Layers />
        <h2>Quản lý Dữ liệu</h2>
      </div>
      
      <div className="layer-tree-content">
        {layerGroups.map(group => (
          <div key={group.id} className="mb-2">
            <button 
              onClick={() => toggleGroup(group.id)}
              className="group-btn"
            >
              {expandedGroups[group.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span>{group.name}</span>
            </button>
            
            {expandedGroups[group.id] && (
              <div className="layers-list">
                {group.layers.map(layer => {
                  const state = layersState.find(s => s.id === layer.id);
                  if (!state) return null;
                  
                  return (
                    <div key={layer.id} className="layer-item">
                      <div className="layer-item-header">
                        <label className={`layer-label ${state.visible ? 'active' : 'inactive'}`}>
                          <input 
                            type="checkbox" 
                            checked={state.visible}
                            onChange={() => toggleLayerVisibility(layer.id)}
                          />
                          <span>{layer.name}</span>
                        </label>
                      </div>
                      
                      {state.visible && (
                        <div className="opacity-slider-container">
                          <span>Mờ</span>
                          <input 
                            type="range" 
                            min="0" max="1" step="0.05"
                            value={state.opacity}
                            onChange={(e) => setLayerOpacity(layer.id, parseFloat(e.target.value))}
                          />
                          <span>Rõ</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerTreeView;
