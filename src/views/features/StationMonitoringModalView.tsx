/**
 * @file StationMonitoringModalView.tsx
 * @directory src/views/features
 * @description Thành phần View Modal theo dõi dữ liệu quan trắc thủy văn & đo mưa tự động thời gian thực (Real-time Telemetry Station Monitoring Modal View).
 * 
 * Kiến trúc MVC: View Component (Feature Modal View)
 * 
 * Chi tiết các chức năng:
 * 1. Bảng số liệu thủy văn real-time: Mực nước đo được (m), cấp báo động lũ (Báo động I, II, III), lưu lượng dòng chảy (m³/s) và nhiệt độ môi trường.
 * 2. Mạng lưới trạm đo mưa tự động: Giám sát lượng mưa 24h và phát hiện lượng mưa vượt ngưỡng cảnh báo ngập lũ.
 * 3. Thẻ chỉ số tổng quan (Stat cards): Thống kê tổng số trạm kết nối, số trạm vượt mức báo động lũ và trạng thái truyền dữ liệu IoT.
 */

import React from 'react';
import { X, Activity, Droplets } from 'lucide-react';

interface StationMonitoringModalViewProps {
  onClose: () => void;
}

export const StationMonitoringModalView: React.FC<StationMonitoringModalViewProps> = ({ onClose }) => {
  const stations = [
    { name: 'Trạm Thủy văn Cung Sơn (Sông Ba)', river: 'Sông Ba', waterLevel: '31.4 m', alertLevel: 'Báo động II (+0.4m)', flow: '850 m³/s', temp: '27.5 °C' },
    { name: 'Trạm Thủy văn An Khê', river: 'Sông Ba', waterLevel: '402.1 m', alertLevel: 'Bình thường', flow: '320 m³/s', temp: '26.8 °C' },
    { name: 'Trạm Quan trắc Hồ Yali', river: 'Sông Sê San', waterLevel: '514.8 m', alertLevel: 'Bình thường', flow: '1240 m³/s', temp: '25.2 °C' },
    { name: 'Trạm Thủy văn Bình Định (Thạnh Hòa)', river: 'Sông Kôn', waterLevel: '7.8 m', alertLevel: 'Báo động I (+0.2m)', flow: '410 m³/s', temp: '28.1 °C' },
    { name: 'Trạm Mưa tự động Sông Hinh', river: 'Sông Hinh', waterLevel: 'Lượng mưa 24h: 145mm', alertLevel: 'Cảnh báo mưa lớn', flow: '--', temp: '26.0 °C' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal glass-panel max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-500" size={20} />
            <h3 className="text-base font-semibold text-gray-800">Theo dõi Dữ liệu Trạm Quan trắc Thủy văn Real-time</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-gray-500">Tổng số Trạm kết nối</div>
              <div className="text-lg font-bold text-blue-600">24 Trạm</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xs text-gray-500">Trạm vượt Báo động</div>
              <div className="text-lg font-bold text-amber-600">2 Trạm</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-xs text-gray-500">Trạng thái Truyền tín hiệu</div>
              <div className="text-lg font-bold text-emerald-600">100% Ổn định</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200">
                  <th className="p-2.5 font-semibold">Tên Trạm Quan trắc</th>
                  <th className="p-2.5 font-semibold">Tuyến Sông</th>
                  <th className="p-2.5 font-semibold">Mực nước / Lượng mưa</th>
                  <th className="p-2.5 font-semibold">Mức Cảnh báo Lũ</th>
                  <th className="p-2.5 font-semibold">Lưu lượng (Q)</th>
                  <th className="p-2.5 font-semibold text-right">Nhiệt độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stations.map((st, idx) => (
                  <tr key={idx} className="hover:bg-cyan-50/40 transition-colors">
                    <td className="p-2.5 font-medium text-gray-800 flex items-center gap-2">
                      <Droplets size={14} className="text-cyan-500" />
                      {st.name}
                    </td>
                    <td className="p-2.5 text-gray-600">{st.river}</td>
                    <td className="p-2.5 font-bold text-blue-600">{st.waterLevel}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        st.alertLevel.includes('Báo động II') ? 'bg-red-100 text-red-800' :
                        st.alertLevel.includes('Báo động I') || st.alertLevel.includes('Cảnh báo') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {st.alertLevel}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-700">{st.flow}</td>
                    <td className="p-2.5 text-right text-gray-500">{st.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationMonitoringModalView;
