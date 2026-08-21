/**
 * @file RiverPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description Thành phần View con chuyên biệt hiển thị thuộc tính sông ngòi, lưu vực mạng lưới thủy hệ và điều khiển đường phát sáng (Highlight).
 * 
 * Kiến trúc MVC: View Component (Popup Sub-View Layer)
 * 
 * Chi tiết chức năng:
 * 1. Hiển thị thông số sông: Mã phân đoạn sông, cấp sông thủy văn, chiều dài dòng chảy (km) và lưu lượng trung bình.
 * 2. Phân tích lưu vực sông: Xác định lưu vực chính (Lưu vực Sông Ba, Sông Kôn, Sông Sê San, Sông Thu Bồn), sông chính và danh sách phụ lưu.
 * 3. Nút công cụ Toggle Highlight: Bật / Tắt hiệu ứng đường sáng dạ quang nổi bật toàn bộ các sông liên quan thuộc cùng lưu vực trên bản đồ.
 */

import React from 'react';
import { Database, Info, Droplets, Activity } from 'lucide-react';
import { getRelatedRivers } from '../../../models/mockData';

interface RiverPopupContentViewProps {
  props: any;
  highlightedRiverBasin: string | null;
  setHighlightedRiverBasin: (basin: string | null) => void;
}

const RiverPopupContentView: React.FC<RiverPopupContentViewProps> = ({ props, highlightedRiverBasin, setHighlightedRiverBasin }) => {
  const riverName = props.ten || props.Vietnamese || props.Ten || props.name || 'Sông';
  const riverId = props.fid || props.Ma || props.OBJECTID || props.id;

  const formatLength = (val: any): string => {
    if (val === undefined || val === null || val === '') return 'Chưa xác định';
    if (typeof val === 'string' && (val.includes('km') || val.includes('m'))) {
      return val;
    }
    const num = Number(val);
    if (isNaN(num)) return String(val);
    
    // Nếu giá trị lớn hơn 1000 -> Đang tính bằng mét (m), quy đổi ra km
    if (num > 1000) {
      return `${(num / 1000).toFixed(2)} km`;
    }
    // Nếu giá trị <= 1000 -> Đang tính sẵn bằng km
    return `${Number(num.toFixed(2))} km`;
  };

  const rawLength = props.chieu_dai ?? props.Chieu_dai ?? props.length ?? props.LENGTH ?? props.len;
  const lengthStr = formatLength(rawLength);

  const riverCap = props.cap !== undefined ? props.cap : props.Cap;
  const relatedRivers = getRelatedRivers(riverId, riverName);

  return (
    <>
      {riverName && (
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Tên sông: <strong>{riverName}</strong></span>
        </div>
      )}
      {riverId !== undefined && (
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Mã phân đoạn: <strong>{riverId}</strong></span>
        </div>
      )}
      {riverCap !== undefined && (
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Cấp sông: <strong>Cấp {riverCap}</strong></span>
        </div>
      )}
      <div className="info-row">
        <Droplets size={14} className="text-blue-500" />
        <span>Chiều dài: <strong>{lengthStr}</strong></span>
      </div>
      {props.discharge && (
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Lưu lượng: <strong>{props.discharge}</strong></span>
        </div>
      )}
      
      <div className="diagrammatic-info" style={{ marginTop: '12px' }}>
        <div className="title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Droplets size={14} className="text-blue-500" />
          Thông tin mạng lưới thủy hệ:
        </div>
        <ul style={{ marginTop: '4px' }}>
          <li><strong>Lưu vực:</strong> {relatedRivers.basin}</li>
          {relatedRivers.mainRiver ? (
            <li><strong>Nhánh của:</strong> {relatedRivers.mainRiver}</li>
          ) : (
            <li><strong>Vai trò:</strong> Sông chính trong hệ thống</li>
          )}
          {relatedRivers.branches.length > 0 && (
            <li><strong>Sông nhánh/Phụ lưu:</strong> {relatedRivers.branches.join(', ')}</li>
          )}
        </ul>
        <button 
          className={`filter-btn-tag mt-2 ${highlightedRiverBasin === relatedRivers.basin ? 'active-filter' : ''}`}
          onClick={() => {
            if (highlightedRiverBasin === relatedRivers.basin) {
              setHighlightedRiverBasin(null);
            } else {
              setHighlightedRiverBasin(relatedRivers.basin);
            }
          }}
          style={{ width: '100%', padding: '6px' }}
        >
          {highlightedRiverBasin === relatedRivers.basin ? 'Ẩn các sông liên quan' : 'Hiển thị các sông liên quan'}
        </button>
      </div>
    </>
  );
};

export default RiverPopupContentView;
