/**
 * @file DamPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description View hiển thị thuộc tính đập & hồ chứa thủy điện trong cửa sổ Popup.
 * 
 * Chức năng chính: View Nội dung Popup Đập Thủy điện (Hydropower Dam Popup Content View)
 * Các chức năng nhỏ:
 * - Hiển thị công suất (MW), sản lượng điện (GWh), năm vận hành, khởi công và trạng thái (Bình thường, Xả lũ, Nguy hiểm).
 * - Các nút tag nhanh lọc đập & hồ chứa theo trạng thái.
 */

import React from 'react';
import { Database, Droplets, Activity, Info } from 'lucide-react';
import type { ReservoirFilterType } from '../../../models/mapTypes';

interface DamPopupContentViewProps {
  props: any;
  reservoirFilter: ReservoirFilterType;
  setReservoirFilter: (filter: ReservoirFilterType) => void;
}

const DamPopupContentView: React.FC<DamPopupContentViewProps> = ({ props, reservoirFilter, setReservoirFilter }) => {
  const isRealHydropower = props.Wattage_PL !== undefined;

  if (!isRealHydropower) {
    return (
      <>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Dung tích: <strong>{props.capacity}</strong></span>
        </div>
        <div className="info-row">
          <Droplets size={14} className="text-blue-500" />
          <span>Lưu vực: <strong>{props.basin}</strong></span>
        </div>
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Trạng thái: <strong>{props.status}</strong></span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="info-row">
        <Database size={14} className="text-blue-500" />
        <span>Công suất: <strong>{props.Wattage_PL} MW</strong></span>
      </div>
      {props['Quantity_('] && (
        <div className="info-row">
          <Droplets size={14} className="text-blue-500" />
          <span>Sản lượng điện: <strong>{props['Quantity_(']} GWh/năm</strong></span>
        </div>
      )}
      {props.Year_of_op && (
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Năm vận hành: <strong>{props.Year_of_op}</strong></span>
        </div>
      )}
      {props.Year_of_la && (
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Khởi công: <strong>{props.Year_of_la}</strong></span>
        </div>
      )}
      <div className="info-row">
        <Activity size={14} className="text-blue-500" />
        <span>Trạng thái: <strong className={`status-text ${props.status === 'Nguy hiểm' ? 'text-red-500' : props.status === 'Xả lũ' ? 'text-amber-500' : 'text-emerald-500'}`}>{props.status || 'Bình thường'}</strong></span>
      </div>
      
      <div className="diagrammatic-info">
        <div className="title">Nền đồ giải (Cartodiagram):</div>
        <ul>
          <li><strong>Kích thước biểu tượng:</strong> Tỷ lệ công suất ({props.Wattage_PL} MW)</li>
          <li><strong>Màu sắc biểu tượng:</strong> Trạng thái ({props.status || 'Bình thường'})</li>
        </ul>
      </div>

      <div className="status-filter-container">
        <div className="title">Lọc hồ chứa theo trạng thái:</div>
        <div className="status-filter-buttons">
          {(['all', 'binh_thuong', 'xa_lu', 'nguy_hiem'] as const).map((filterVal) => {
            const labels = {
              all: 'Tất cả',
              binh_thuong: 'Bình thường',
              xa_lu: 'Xả lũ',
              nguy_hiem: 'Nguy hiểm'
            };
            return (
              <button
                key={filterVal}
                onClick={() => setReservoirFilter(filterVal)}
                className={`filter-btn-tag ${reservoirFilter === filterVal ? 'active-filter' : ''}`}
              >
                {labels[filterVal]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DamPopupContentView;
