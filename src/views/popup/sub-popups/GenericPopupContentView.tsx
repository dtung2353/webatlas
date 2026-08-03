/**
 * @file GenericPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description View hiển thị thuộc tính trạm quan trắc, vùng ngập lụt, hạn hán, mặn, vùng sinh lũ và vị trí bất kỳ.
 * 
 * Chức năng chính: View Nội dung Popup Trạm Quan trắc & Hiểm họa (Generic & Hazard Popup Content View)
 * Các chức năng nhỏ:
 * - Trạm quan trắc thủy văn / lượng mưa.
 * - Vùng ngập lụt & diện tích ngập.
 * - Điểm khảo sát hạn hán & mặn.
 * - Vùng sinh lũ & diện tích lưu vực.
 * - Vị trí tọa độ địa lý (Kinh độ/Vĩ độ).
 */

import React from 'react';
import { Database, Activity, Info, Droplets } from 'lucide-react';

interface GenericPopupContentViewProps {
  props: any;
}

const GenericPopupContentView: React.FC<GenericPopupContentViewProps> = ({ props }) => {
  // Trạm quan trắc
  if (props.value !== undefined) {
    return (
      <>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Loại trạm: <strong>{props.type}</strong></span>
        </div>
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Giá trị đo: <strong>{props.value}</strong></span>
        </div>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Trạng thái hoạt động: <strong>{props.status}</strong></span>
        </div>
      </>
    );
  }

  // Vùng ngập lụt
  if (props.type === 'Vùng ngập lụt' && props.area !== undefined) {
    return (
      <>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Phân loại: <strong>{props.type}</strong></span>
        </div>
        <div className="info-row">
          <Droplets size={14} className="text-blue-500" />
          <span>Diện tích ảnh hưởng: <strong>{props.area}</strong></span>
        </div>
      </>
    );
  }

  // Khảo sát hạn hán
  if (props.type === 'Khảo sát hạn hán') {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Phân loại: <strong>{props.type}</strong></span>
        </div>
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Trạng thái: <strong>{props.status}</strong></span>
        </div>
        {props.surveyDate && (
          <div className="info-row">
            <Database size={14} className="text-blue-500" />
            <span>Ngày khảo sát: <strong>{props.surveyDate}</strong></span>
          </div>
        )}
      </>
    );
  }

  // Xâm nhập mặn
  if (props.type === 'Xâm nhập mặn') {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Phân loại: <strong>{props.type}</strong></span>
        </div>
        <div className="info-row">
          <Droplets size={14} className="text-blue-500" />
          <span>Độ mặn đo được: <strong>{props.salinity}</strong></span>
        </div>
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Trạng thái: <strong>{props.status}</strong></span>
        </div>
      </>
    );
  }

  // Vùng sinh lũ
  if (props.type === 'Vùng sinh lũ') {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Phân loại: <strong>{props.type}</strong></span>
        </div>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Diện tích lưu vực: <strong>{props.area}</strong></span>
        </div>
        <div className="info-row">
          <Activity size={14} className="text-blue-500" />
          <span>Đặc điểm lũ: <strong>{props.flowRate}</strong></span>
        </div>
      </>
    );
  }

  // Vị trí tọa độ địa lý
  if (props.type === 'Vị trí địa lý' || props.coordinateText) {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Kinh độ (Lon): <strong>{props.longitude}°E</strong></span>
        </div>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Vĩ độ (Lat): <strong>{props.latitude}°N</strong></span>
        </div>
      </>
    );
  }

  const knownSkipKeys = ['_layerName', 'geometry', 'boundedBy'];
  const displayProps = Object.entries(props).filter(([k]) => !knownSkipKeys.includes(k));
  if (displayProps.length > 0) {
    return (
      <>
        {displayProps.map(([key, value]) => (
          <div key={key} className="info-row">
            <Info size={14} className="text-blue-500" />
            <span>{key}: <strong>{String(value)}</strong></span>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="info-row">
      <Info size={14} className="text-blue-500" />
      <span>Phân loại: <strong>{props.type || 'Chưa phân loại'}</strong></span>
    </div>
  );
};

export default GenericPopupContentView;
