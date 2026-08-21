/**
 * @file DamPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description Thành phần View con chuyên biệt hiển thị thông số thuộc tính kỹ thuật & vận hành đập / hồ chứa thủy điện.
 * 
 * Kiến trúc MVC: View Component (Popup Sub-View Layer)
 * 
 * Chi tiết chức năng:
 * 1. Hiển thị thông số công suất thiết kế (MW), sản lượng điện hàng năm (GWh), năm vận hành, năm khởi công.
 * 2. Phân loại trạng thái vận hành đập real-time (Bình thường, Xả lũ, Cảnh báo nguy hiểm) với highlight màu sắc.
 * 3. Chú giải nền đồ giải (Cartodiagram): Giải thích quy luật tỷ lệ kích thước & màu sắc biểu tượng đập trên bản đồ.
 * 4. Cung cấp các nút tag lọc nhanh đập hồ chứa theo trạng thái vận hành (`all`, `binh_thuong`, `xa_lu`, `nguy_hiem`).
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
  const damName = props.ten_cong_trinh || props.Vietnamese || props.name || props.Ten || props.ten;
  const damId = props.fid ?? props.id ?? props.ID ?? props.osm_id ?? props.ma_cong_trinh ?? props.OBJECTID;
  const wattage = props.cong_suat_mw ?? props.cong_suat ?? props.Wattage_PL ?? props.wattage ?? props.power;
  const capacityStr = props.dung_tich_trieu_m3 !== undefined 
    ? `${props.dung_tich_trieu_m3} triệu m³` 
    : props.capacity;
  const statusStr = props.tinh_trang || props.status || 'Bình thường';
  const basinStr = props.basin || props.luu_vuc;
  const outputStr = props['Quantity_('] || props.san_luong_gwh;
  const yearOp = props.Year_of_op || props.nam_van_hanh;
  const yearLa = props.Year_of_la || props.nam_khoi_cong;

  return (
    <>
      {damName && (
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Tên đập / hồ chứa: <strong>{damName}</strong></span>
        </div>
      )}
      {damId !== undefined && damId !== null && (
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Mã định danh (ID): <strong>{damId}</strong></span>
        </div>
      )}
      {wattage !== undefined && wattage !== null && wattage !== '' && (
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Công suất thiết kế: <strong>{wattage} MW</strong></span>
        </div>
      )}
      {capacityStr && (
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Dung tích: <strong>{capacityStr}</strong></span>
        </div>
      )}
      {basinStr && (
        <div className="info-row">
          <Droplets size={14} className="text-blue-500" />
          <span>Lưu vực: <strong>{basinStr}</strong></span>
        </div>
      )}
      {outputStr && (
        <div className="info-row">
          <Droplets size={14} className="text-blue-500" />
          <span>Sản lượng điện: <strong>{outputStr} GWh/năm</strong></span>
        </div>
      )}
      {yearOp && (
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Năm vận hành: <strong>{yearOp}</strong></span>
        </div>
      )}
      {yearLa && (
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Khởi công: <strong>{yearLa}</strong></span>
        </div>
      )}
      <div className="info-row">
        <Activity size={14} className="text-blue-500" />
        <span>Trạng thái: <strong className={`status-text ${statusStr === 'Nguy hiểm' ? 'text-red-500' : statusStr === 'Xả lũ' ? 'text-amber-500' : 'text-emerald-500'}`}>{statusStr}</strong></span>
      </div>
      
      <div className="diagrammatic-info">
        <div className="title">Nền đồ giải (Cartodiagram):</div>
        <ul>
          {wattage !== undefined && wattage !== null && (
            <li><strong>Kích thước biểu tượng:</strong> Tỷ lệ công suất ({wattage} MW)</li>
          )}
          <li><strong>Màu sắc biểu tượng:</strong> Trạng thái ({statusStr})</li>
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
