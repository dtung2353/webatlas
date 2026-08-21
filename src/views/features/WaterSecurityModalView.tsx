/**
 * @file WaterSecurityModalView.tsx
 * @directory src/views/features
 * @description Modal Phân tích an ninh nguồn nước (Water Security & Vulnerability Analysis Modal).
 */

import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface WaterSecurityModalViewProps {
  onClose: () => void;
}

export const WaterSecurityModalView: React.FC<WaterSecurityModalViewProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal glass-panel max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={20} />
            <h3 className="text-base font-semibold text-gray-800">Phân tích An ninh Nguồn nước & Nguy cơ Tự nhiên</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-800">Chỉ số An toàn Cấp nước</span>
                <span className="text-xs font-bold text-blue-600">84.5%</span>
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '84.5%' }}></div>
              </div>
              <p className="text-xs text-gray-600">
                Nguồn nước sinh hoạt và sản xuất nông nghiệp mùa khô tại lưu vực Sông Ba và Sông Kôn được đảm bảo ở mức An toàn.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-purple-800">Nguy cơ Xâm nhập mặn & Hạn hán</span>
                <span className="text-xs font-bold text-amber-600">Cảnh báo Trung bình</span>
              </div>
              <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }}></div>
              </div>
              <p className="text-xs text-gray-600">
                Vùng hạ lưu sông Đà Rằng (Phú Yên) xuất hiện độ mặn ranh giới 4‰ xâm nhập sâu 12km vào nội địa.
              </p>
            </div>
          </div>

          <div className="p-4 glass-panel rounded-xl border border-gray-200 space-y-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={16} className="text-blue-500" />
              Đánh giá Tổng hợp An ninh Nguồn nước Lưu vực Sông
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                <span className="font-medium text-gray-800">Lưu vực Sông Ba (Phú Yên - Gia Lai)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">An toàn (Tốt)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                <span className="font-medium text-gray-800">Lưu vực Sông Kôn - Hà Thanh (Bình Định)</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">Cảnh báo hạn nội đồng</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                <span className="font-medium text-gray-800">Lưu vực Sông Sê San (Gia Lai - Kon Tum)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">An toàn (Tốt)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterSecurityModalView;
