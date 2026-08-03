/**
 * @file AdminPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description View hiển thị thuộc tính ranh giới đơn vị hành chính (Tỉnh, Huyện, Xã/Phường).
 * 
 * Chức năng chính: View Nội dung Popup Ranh giới Hành chính (Admin Boundary Popup Content View)
 * Các chức năng nhỏ:
 * - Hiển thị Tên đơn vị hành chính, tên đơn vị trực thuộc.
 * - Hiển thị thông tin đơn vị trước sáp nhập, mã đơn vị và phân loại đơn vị.
 */

import React from 'react';
import { Info, Database, Activity, Layers } from 'lucide-react';

interface AdminPopupContentViewProps {
  props: any;
}

const AdminPopupContentView: React.FC<AdminPopupContentViewProps> = ({ props }) => {
  if (props.truocsn !== undefined) {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Tên đầy đủ: <strong>{props.fullName}</strong></span>
        </div>
        {props.truocsn && (
          <div className="info-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} className="text-blue-500" />
              <span>Trước sáp nhập:</span>
            </div>
            <strong className="text-gray-700 text-xs ml-5 leading-normal" style={{ whiteSpace: 'pre-wrap' }}>{props.truocsn}</strong>
          </div>
        )}
      </>
    );
  }

  if (props.NAME_1 !== undefined) {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Cấp hành chính: <strong>{props.NAME_3 ? 'Xã/Phường' : props.NAME_2 ? 'Quận/Huyện' : 'Tỉnh/Thành phố'}</strong></span>
        </div>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Trực thuộc: <strong>{props.NAME_2 ? `${props.NAME_2}, ` : ''}{props.NAME_1}</strong></span>
        </div>
        {props.ENGTYPE_1 && (
          <div className="info-row">
            <Activity size={14} className="text-blue-500" />
            <span>Phân loại: <strong>{props.ENGTYPE_3 || props.ENGTYPE_2 || props.ENGTYPE_1}</strong></span>
          </div>
        )}
      </>
    );
  }

  const provinceName = props.adm1_name || props.ten_tinh || props.NAME_1 || 'Không xác định';
  const provinceCode = props.adm1_pcode || props.code || props.GID_1 || props.CC_1;
  const provinceId = props.gid || props.GID_0 || props.fid;
  const provinceType = props.adm1_type_vi || props.ENGTYPE_1 || props.TYPE_1;

  return (
    <>
      <div className="info-row">
        <Info size={14} className="text-blue-500" />
        <span>Tên tỉnh: <strong>{provinceName}</strong></span>
      </div>
      {provinceCode && (
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Mã tỉnh: <strong>{provinceCode}</strong></span>
        </div>
      )}
      {provinceId && (
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>ID: <strong>{provinceId}</strong></span>
        </div>
      )}
      {provinceType && (
        <div className="info-row">
          <Layers size={14} className="text-blue-500" />
          <span>Loại đơn vị: <strong>{provinceType}</strong></span>
        </div>
      )}
    </>
  );
};

export default AdminPopupContentView;
