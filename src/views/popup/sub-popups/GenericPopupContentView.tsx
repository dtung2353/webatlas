/**
 * @file GenericPopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description Thành phần View con chuyên biệt hiển thị thuộc tính trạm quan trắc, hiểm họa thiên tai (Ngập lụt, Hạn hán, Xâm nhập mặn, Vùng sinh lũ) và vị trí tọa độ địa lý.
 * 
 * Kiến trúc MVC: View Component (Popup Sub-View Layer)
 * 
 * Chi tiết chức năng:
 * 1. Trạm quan trắc thủy văn: Hiển thị loại trạm (Đo mực nước, đo mưa), giá trị đo real-time và trạng thái hoạt động.
 * 2. Vùng ngập lụt: Hiển thị phân loại ngập lụt và diện tích vùng bị ảnh hưởng ngập (ha/km²).
 * 3. Điểm khảo sát hạn hán: Hiển thị mức độ hạn hán, trạng thái cảnh báo và ngày khảo sát thực địa.
 * 4. Xâm nhập mặn: Hiển thị độ mặn đo được tại cửa sông (‰ - phần ngàn) và mức độ xâm nhập.
 * 5. Vùng sinh lũ: Hiển thị diện tích lưu vực sinh lũ và đặc điểm lưu lượng đỉnh lũ.
 * 6. Vị trí địa lý bất kỳ: Tự động trích xuất Kinh độ (Lon °E) & Vĩ độ (Lat °N) khi nhấp chuột trên bản đồ.
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

  // Điểm dân cư & Đô thị
  if (props.population !== undefined || (props._layerName && props._layerName.includes('dia_diem_dan_cu'))) {
    const popTypeMap: Record<string, string> = {
      national_capital: 'Thủ đô Quốc gia',
      city: 'Thành phố trực thuộc / Đô thị lớn',
      town: 'Thị xã / Thị trấn',
      village: 'Làng / Thôn / Bản',
      hamlet: 'Xóm / Ấp / Cụm dân cư',
      suburb: 'Khu đô thị ngoại thành'
    };
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-rose-500" />
          <span>Tên địa danh: <strong>{props.name || 'Điểm dân cư'}</strong></span>
        </div>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Phân loại đô thị: <strong>{popTypeMap[props.fclass] || props.fclass || 'Khu dân cư'}</strong></span>
        </div>
        {props.population !== undefined && props.population !== null && (
          <div className="info-row">
            <Activity size={14} className="text-emerald-500" />
            <span>Quy mô dân số: <strong>{Number(props.population).toLocaleString('vi-VN')} người</strong></span>
          </div>
        )}
        {props.osm_id && (
          <div className="info-row">
            <Database size={14} className="text-gray-400" />
            <span>Mã OSM: <strong>#{props.osm_id}</strong></span>
          </div>
        )}
      </>
    );
  }

  // Đường sắt Việt Nam
  if (props._layerName && props._layerName.includes('duong_sat')) {
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-gray-700" />
          <span>Tên tuyến đường sắt: <strong>{props.name || 'Tuyến đường sắt'}</strong></span>
        </div>
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Loại hình: <strong>{props.fclass === 'rail' ? 'Tuyến đường sắt chính' : props.fclass || 'Đường ray'}</strong></span>
        </div>
        {props.osm_id && (
          <div className="info-row">
            <Database size={14} className="text-gray-400" />
            <span>Mã OSM: <strong>#{props.osm_id}</strong></span>
          </div>
        )}
      </>
    );
  }

  // Giao thông đường bộ
  if (props.maxspeed !== undefined || props.oneway !== undefined || (props._layerName && props._layerName.includes('giao_thong'))) {
    const roadTypeMap: Record<string, string> = {
      motorway: 'Đường cao tốc',
      trunk: 'Quốc lộ huyết mạch',
      primary: 'Đường trục chính / Tỉnh lộ',
      secondary: 'Đường liên huyện',
      tertiary: 'Đường liên xã',
      residential: 'Đường khu dân cư / Đô thị',
      living_street: 'Đường nội bộ',
      pedestrian: 'Đường đi bộ / Phố đi bộ',
      footway: 'Đường bộ hành / Cầu vượt bộ',
      track: 'Đường tuần tra / Lâm nghiệp',
      service: 'Đường nhánh / Gom'
    };
    const onewayText = props.oneway === 'F' ? 'Một chiều (chiều thuận)' : props.oneway === 'T' ? 'Một chiều (chiều ngược)' : props.oneway === 'B' ? 'Hai chiều' : 'Lưu thông thông thường';
    return (
      <>
        <div className="info-row">
          <Info size={14} className="text-amber-500" />
          <span>Tên đường: <strong>{props.name || (props.ref ? `Tuyến ${props.ref}` : 'Đoạn đường giao thông')}</strong></span>
        </div>
        {props.ref && (
          <div className="info-row">
            <Database size={14} className="text-blue-500" />
            <span>Ký hiệu tuyến: <strong>{props.ref}</strong></span>
          </div>
        )}
        <div className="info-row">
          <Database size={14} className="text-blue-500" />
          <span>Cấp kỹ thuật: <strong>{roadTypeMap[props.fclass] || props.fclass || 'Đường bộ'}</strong></span>
        </div>
        {props.oneway && (
          <div className="info-row">
            <Activity size={14} className="text-blue-500" />
            <span>Lưu thông: <strong>{onewayText}</strong></span>
          </div>
        )}
        {props.maxspeed > 0 && (
          <div className="info-row">
            <Activity size={14} className="text-emerald-500" />
            <span>Tốc độ tối đa: <strong>{props.maxspeed} km/h</strong></span>
          </div>
        )}
      </>
    );
  }

  // Hồ mặt nước & Vùng nước
  if (props.fclass !== undefined || (props._layerName && props._layerName.includes('ho_mat_nuoc'))) {
    const fclassLabelMap: Record<string, string> = {
      water: 'Mặt nước / Hồ tự nhiên',
      reservoir: 'Hồ chứa nhân tạo',
      riverbank: 'Lòng sông / Bãi bồi',
      wetland: 'Vùng đất ngập nước',
      wetland_marsh: 'Đầm lầy nước ngọt',
      wetland_mangrove: 'Rừng ngập mặn',
      wetland_swamp: 'Đầm lầy ngập nước',
      dock: 'Vụng bến thủy'
    };
    return (
      <>
        <div className="info-row">
          <Droplets size={14} className="text-sky-500" />
          <span>Tên hồ / mặt nước: <strong>{props.name || 'Hồ mặt nước (chưa đặt tên)'}</strong></span>
        </div>
        <div className="info-row">
          <Info size={14} className="text-blue-500" />
          <span>Phân loại: <strong>{fclassLabelMap[props.fclass] || props.fclass || 'Mặt nước'}</strong></span>
        </div>
        {props.osm_id && (
          <div className="info-row">
            <Database size={14} className="text-blue-500" />
            <span>Mã định danh OSM: <strong>#{props.osm_id}</strong></span>
          </div>
        )}
      </>
    );
  }

  const knownSkipKeys = ['_layerName', 'geometry', 'boundedBy'];
  const displayProps = Object.entries(props).filter(([k]) => !knownSkipKeys.includes(k));
  
  const keyLabelMap: Record<string, string> = {
    ten_cong_trinh: 'Tên công trình',
    ten_tram: 'Tên trạm quan trắc',
    loai_tram: 'Loại trạm',
    gia_tri_hien_tai: 'Giá trị đo hiện tại',
    ten_vung: 'Tên vùng',
    muc_do_nguy_co: 'Mức độ nguy cơ',
    do_sau_ngap_m: 'Độ sâu ngập (m)',
    ten_diem: 'Tên điểm khảo sát',
    cap_do_han: 'Cấp độ hạn hán',
    do_am_dat: 'Độ ẩm đất',
    do_man_g_l: 'Độ mặn (g/l)',
    pham_vi_anh_huong_km: 'Phạm vi ảnh hưởng (km)',
    ten_luu_vuc: 'Tên lưu vực sinh lũ',
    nguy_co_lu_quet: 'Nguy cơ lũ quét',
    dung_tich_trieu_m3: 'Dung tích (triệu m³)',
    cong_suat_mw: 'Công suất (MW)',
    tinh_trang: 'Trạng thái hoạt động',
    ten: 'Tên đối tượng',
    cap: 'Cấp phân đoạn',
    chieu_dai: 'Chiều dài (km)',
    fid: 'Mã định danh (ID)'
  };

  if (displayProps.length > 0) {
    return (
      <>
        {displayProps.map(([key, value]) => (
          <div key={key} className="info-row">
            <Info size={14} className="text-blue-500" />
            <span>{keyLabelMap[key] || key}: <strong>{String(value)}</strong></span>
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
