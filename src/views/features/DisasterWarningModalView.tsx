/**
 * @file DisasterWarningModalView.tsx
 * @directory src/views/features
 * @description Modal Theo dõi dự báo & cảnh báo thiên tai (Disaster Warning & Alert Center Modal).
 */

import React from 'react';
import { X, AlertTriangle, Droplets } from 'lucide-react';

interface DisasterWarningModalViewProps {
  onClose: () => void;
}

export const DisasterWarningModalView: React.FC<DisasterWarningModalViewProps> = ({ onClose }) => {
  const alerts = [
    { type: 'Ngập lụt', level: 'Báo động Cấp 2', area: 'Hạ lưu Sông Ba (Huyện Phú Hòa, TX Đông Hòa - Phú Yên)', time: '10 phút trước', desc: 'Dự báo nguy cơ ngập lụt vùng cục bộ ven sông do lưu lượng xả từ thủy điện.' },
    { type: 'Mưa lớn', level: 'Cảnh báo Cấp 1', area: 'Vùng núi Tỉnh Gia Lai & Kon Tum', time: '1 giờ trước', desc: 'Lượng mưa dự báo từ 100-180mm trong 24 giờ tới. Cảnh báo nguy cơ sạt lở đất.' },
    { type: 'Xâm nhập mặn', level: 'Theo dõi', area: 'Cửa sông Tuy Hòa', time: '3 giờ trước', desc: 'Độ mặn dao động 3.5‰ - 5‰ trong chu kỳ triều cường.' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal glass-panel max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500 animate-bounce" size={20} />
            <h3 className="text-base font-semibold text-gray-800">Theo dõi Dự báo & Cảnh báo Thiên tai Real-time</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-medium">
            <AlertTriangle size={16} className="flex-shrink-0 text-amber-600" />
            <span>Hệ thống tự động phát tin cảnh báo thiên tai thủy văn dựa trên dữ liệu trạm đo mưa và xả lũ thực tế.</span>
          </div>

          <div className="space-y-3">
            {alerts.map((al, idx) => (
              <div key={idx} className="p-4 glass-panel rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="text-blue-500" size={18} />
                    <span className="font-bold text-sm text-gray-800">{al.type}: {al.area}</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    {al.level}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{al.desc}</p>
                <div className="text-[11px] text-gray-400 text-right">Cập nhật: {al.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterWarningModalView;
