/**
 * @file DamDetailModalView.tsx
 * @directory src/views/popup
 * @description View Modal hiển thị chi tiết thông số kỹ thuật đập & đánh giá hiện trạng an toàn (Dam Details Modal View Component).
 * 
 * Chức năng chính: View Modal Chi tiết Kỹ thuật An toàn Đập Thủy điện (Hydropower Dam Safety Detail Modal View)
 * Các chức năng nhỏ:
 * - Hiển thị loại đập, loại vật liệu, cấp công trình, cao trình đỉnh đập, tường chắn sóng.
 * - Đánh giá hiện trạng an toàn mái thượng lưu, rò rỉ thấm nước nặng/nhẹ.
 */

import React from 'react';
import { Database, X, Sliders, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { DamDetails } from '../../models/mapTypes';

interface DamDetailModalViewProps {
  /** Thông tin chi tiết đập */
  detail: DamDetails;
  /** Hàm đóng modal */
  onClose: () => void;
}

const DamDetailModalView: React.FC<DamDetailModalViewProps> = ({ detail, onClose }) => {
  return (
    <div className="ogc-modal-overlay" onClick={onClose}>
      <div className="ogc-modal glass-panel dam-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ogc-modal-header">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Database size={18} className="text-blue-500" />
            <span>Chi tiết chuyên sâu: {detail.ten}</span>
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="ogc-modal-content">
          <div className="details-grid">
            
            {/* Thông số kỹ thuật */}
            <div className="details-section">
              <h4>
                <Sliders size={15} />
                <span>Thông số kỹ thuật đập</span>
              </h4>
              <div className="detail-item">
                <span className="detail-label">Loại đập</span>
                <span className="detail-value">{detail.loai}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Loại vật liệu</span>
                <span className="detail-value">{detail.vatLieu}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cấp công trình</span>
                <span className="detail-value">{detail.capCongTrinh}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cao trình đỉnh đập</span>
                <span className="detail-value">{detail.caoTrinhDinh}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cao trình tường chắn sóng</span>
                <span className="detail-value">{detail.caoTrinhTuongChan}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Chiều dài đập</span>
                <span className="detail-value">{detail.chieuDai}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Chiều cao lớn nhất</span>
                <span className="detail-value">{detail.chieuCaoMax}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Chiều rộng đỉnh đập</span>
                <span className="detail-value">{detail.chieuRongDinh}</span>
              </div>
            </div>

            {/* An toàn đập */}
            <div className="details-section">
              <h4>
                <ShieldCheck size={15} />
                <span>Hiện trạng an toàn đập</span>
              </h4>
              <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="detail-label">Mái thượng lưu không gia cố</span>
                <span className={`status-indicator ${detail.maiThuongLuu.includes('sạt trượt') ? 'status-warning' : 'status-safe'}`}>
                  {detail.maiThuongLuu.includes('sạt trượt') ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                  {detail.maiThuongLuu}
                </span>
              </div>
              <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="detail-label">Hiện trạng thấm nước nặng</span>
                <span className={`status-indicator ${detail.thamNang.includes('rò rỉ') ? 'status-danger' : 'status-safe'}`}>
                  {detail.thamNang.includes('rò rỉ') ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                  {detail.thamNang}
                </span>
              </div>
              <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="detail-label">Hiện trạng thấm nước nhẹ</span>
                <span className={`status-indicator ${detail.thamNhe.includes('Thấm ẩm') ? 'status-warning' : 'status-safe'}`}>
                  {detail.thamNhe.includes('Thấm ẩm') ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                  {detail.thamNhe}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DamDetailModalView;
