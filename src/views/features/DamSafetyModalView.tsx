/**
 * @file DamSafetyModalView.tsx
 * @directory src/views/features
 * @description Modal Đánh giá an toàn hồ và đập (Dam & Reservoir Safety Risk Matrix Modal).
 */

import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface DamSafetyModalViewProps {
  onClose: () => void;
}

export const DamSafetyModalView: React.FC<DamSafetyModalViewProps> = ({ onClose }) => {
  const damSafetyData = [
    { name: 'Thủy điện Yali', riskScore: '98/100', assessment: 'Rất an toàn', sensors: 'Thấm, Chuyển vị, Áp lực kẻ hở tốt', lastCheck: '05/08/2026' },
    { name: 'Thủy điện Sông Ba Hạ', riskScore: '92/100', assessment: 'An toàn', sensors: 'Hệ thống cảnh báo hạ lưu đạt chuẩn', lastCheck: '02/08/2026' },
    { name: 'Hồ chứa Định Bình', riskScore: '78/100', assessment: 'Cần kiểm tra định kỳ', sensors: 'Phát hiện vết bồi đắp bãi tràn', lastCheck: '28/07/2026' },
    { name: 'Thủy điện Sông Hinh', riskScore: '95/100', assessment: 'Rất an toàn', sensors: 'Vận hành hoàn toàn tự động', lastCheck: '01/08/2026' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal glass-panel max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" size={20} />
            <h3 className="text-base font-semibold text-gray-800">Đánh giá An toàn Đập & Hồ chứa Thủy lợi / Thủy điện</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-xs text-gray-500">Đập An toàn</div>
              <div className="text-lg font-bold text-emerald-600">18 Hồ</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xs text-gray-500">Cần giám sát</div>
              <div className="text-lg font-bold text-amber-600">3 Hồ</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs text-gray-500">Cảnh báo cao</div>
              <div className="text-lg font-bold text-red-600">0 Hồ</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-gray-500">Cảm biến IoT</div>
              <div className="text-lg font-bold text-blue-600">100% Hoạt động</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200">
                  <th className="p-2.5 font-semibold">Công trình Hồ Đập</th>
                  <th className="p-2.5 font-semibold">Điểm An toàn</th>
                  <th className="p-2.5 font-semibold">Kết luận Đánh giá</th>
                  <th className="p-2.5 font-semibold">Trạng thái Quan trắc Cảm biến</th>
                  <th className="p-2.5 font-semibold text-right">Ngày kiểm định</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {damSafetyData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="p-2.5 font-medium text-gray-800">{item.name}</td>
                    <td className="p-2.5 font-bold text-indigo-600">{item.riskScore}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.assessment.includes('Rất an toàn') ? 'bg-emerald-100 text-emerald-800' :
                        item.assessment.includes('An toàn') ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.assessment}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-600">{item.sensors}</td>
                    <td className="p-2.5 text-right text-gray-400">{item.lastCheck}</td>
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

export default DamSafetyModalView;
