/**
 * @file FeatureDockView.tsx
 * @directory src/views/features
 * @description View hiển thị nút ẩn các chức năng ở góc dưới bên phải. Khi bấm vào, thanh hiển thị 7 chức năng hiện ra.
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  X
} from 'lucide-react';

import ReservoirManagementModalView from './ReservoirManagementModalView';
import StationMonitoringModalView from './StationMonitoringModalView';
import WaterSecurityModalView from './WaterSecurityModalView';
import DisasterWarningModalView from './DisasterWarningModalView';
import DamSafetyModalView from './DamSafetyModalView';
import PDFExportButtonView from '../export/PDFExportButtonView';
import LayerTreeView from '../layers/LayerTreeView';

export const FeatureDockView: React.FC = () => {
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const features = [
    {
      id: 'layer_management',
      name: 'Quản lý dữ liệu bản đồ',
      icon: <Layers size={18} className="text-blue-500" />,
      color: 'hover:bg-blue-50 hover:border-blue-300'
    },
    {
      id: 'reservoir_management',
      name: 'Quản lý hồ chứa & đập',
      icon: <Database size={18} className="text-emerald-500" />,
      color: 'hover:bg-emerald-50 hover:border-emerald-300'
    },
    {
      id: 'station_monitoring',
      name: 'Theo dõi dữ liệu trạm quan trắc',
      icon: <Database size={18} className="text-cyan-500" />,
      color: 'hover:bg-cyan-50 hover:border-cyan-300'
    },
    {
      id: 'water_security',
      name: 'Phân tích an ninh nguồn nước',
      icon: <ShieldCheck size={18} className="text-indigo-500" />,
      color: 'hover:bg-indigo-50 hover:border-indigo-300'
    },
    {
      id: 'disaster_warning',
      name: 'Theo dõi dự báo & cảnh báo thiên tai',
      icon: <AlertTriangle size={18} className="text-amber-500" />,
      color: 'hover:bg-amber-50 hover:border-amber-300'
    },
    {
      id: 'dam_safety',
      name: 'Đánh giá an toàn hồ và đập',
      icon: <ShieldCheck size={18} className="text-purple-500" />,
      color: 'hover:bg-purple-50 hover:border-purple-300'
    },
    {
      id: 'reports',
      name: 'Báo cáo',
      icon: <FileText size={18} className="text-rose-500" />,
      color: 'hover:bg-rose-50 hover:border-rose-300'
    }
  ];

  return (
    <div className="bottom-right-dock-container">
      {/* Thanh hiển thị 7 chức năng xếp dọc */}
      {isDockOpen && (
        <div className="feature-dock-bar glass-panel">
          <div className="dock-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {features.map((ft) => (
              <button
                key={ft.id}
                className={`dock-item-btn glass-panel ${ft.color} ${activeModal === ft.id ? 'active' : ''}`}
                onClick={() => setActiveModal(ft.id)}
                title={ft.name}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '10px', textAlign: 'left' }}
              >
                <div className="dock-icon flex items-center justify-center flex-shrink-0">
                  {ft.icon}
                </div>
                <span className="dock-label text-xs font-medium text-gray-700 whitespace-nowrap text-left">
                  {ft.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nút ẩn/hiện các chức năng ở góc dưới bên phải với ion-icon menu-outline (Chỉ giữ Icon) */}
      <button 
        className={`dock-toggle-fab glass-panel ${isDockOpen ? 'active' : ''}`}
        onClick={() => setIsDockOpen(!isDockOpen)}
        title={isDockOpen ? 'Ẩn các chức năng' : 'Hiện thanh chức năng'}
      >
        <svg width="20" height="20" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="36" strokeLinecap="round" strokeMiterlimit="10" className="text-blue-600 flex-shrink-0">
          <line x1="80" y1="160" x2="432" y2="160" />
          <line x1="80" y1="256" x2="432" y2="256" />
          <line x1="80" y1="352" x2="432" y2="352" />
        </svg>
      </button>

      {/* Render Modal cho các chức năng được chọn */}
      {activeModal === 'layer_management' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="feature-modal glass-panel max-w-md w-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <span className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                <Layers size={18} className="text-blue-500" /> Quản lý Dữ liệu Lớp Bản đồ
              </span>
              <button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <div className="layer-tree-embedded">
              <LayerTreeView />
            </div>
          </div>
        </div>
      )}

      {activeModal === 'reservoir_management' && (
        <ReservoirManagementModalView onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'station_monitoring' && (
        <StationMonitoringModalView onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'water_security' && (
        <WaterSecurityModalView onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'disaster_warning' && (
        <DisasterWarningModalView onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'dam_safety' && (
        <DamSafetyModalView onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'reports' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="feature-modal glass-panel max-w-lg w-full p-6 text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="text-rose-500" size={20} /> Xuất Báo cáo & Atlas
              </h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-600 text-left">
              Hệ thống hỗ trợ tự động tổng hợp thông số bản đồ, biểu đồ lưu lượng hồ đập và dữ liệu quan trắc thành file Báo cáo PDF chất lượng cao.
            </p>
            <div className="py-2 flex justify-center">
              <PDFExportButtonView />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureDockView;
