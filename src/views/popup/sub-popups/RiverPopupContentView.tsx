/**
 * @file RiverPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description View hiển thị thuộc tính sông ngòi, lưu vực thủy hệ và nút bật highlight sông liên quan.
 * 
 * Chức năng chính: View Nội dung Popup Sông ngòi & Thủy hệ (River & River Basin Popup Content View)
 * Các chức năng nhỏ:
 * - Hiển thị mã phân đoạn, cấp sông, chiều dài và lưu lượng.
 * - Hiển thị tên lưu vực sông, sông chính và các sông nhánh phụ lưu.
 * - Nút toggle Bật / Ẩn đường phát sáng (Highlight) các sông liên quan thuộc cùng lưu vực.
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
  const lengthStr = props.Chieu_dai !== undefined 
    ? `${(props.Chieu_dai / 1000).toFixed(2)} km` 
    : props.length;
    
  const relatedRivers = getRelatedRivers(props.OBJECTID || props.Ma, props.Vietnamese || props.Ten || props.name || 'Sông');

  return (
    <>
      {props.Ma && (
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Mã phân đoạn: <strong>{props.Ma}</strong></span>
        </div>
      )}
      {props.Cap !== undefined && (
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Cấp sông: <strong>Cấp {props.Cap}</strong></span>
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
