/**
 * @file LakePopupContentView.tsx
 * @directory src/views/popup/sub-popups
 * @description Thành phần View con chuyên biệt hiển thị thông tin chi tiết về hồ, mặt nước tự nhiên và hồ chứa thủy lợi khi người dùng nhấp chọn trên bản đồ.
 * 
 * Kiến trúc MVC: View Component (Popup Sub-View Layer)
 * 
 * Chi tiết chức năng:
 * 1. Hiển thị tên hồ (Hồ Tây, Hồ Dầu Tiếng, Hồ Ba Mẫu, Hồ Xã Đàn...) hoặc định danh hồ mặt nước.
 * 2. Phân loại thủy vực (Hồ tự nhiên, Hồ chứa nhân tạo, Vùng đất ngập nước, Đầm lầy...).
 * 3. Đánh giá công năng khai thác (Điều tiết lũ, cấp nước sinh hoạt, thủy lợi, cảnh quan sinh thái).
 * 4. Nút công cụ "Phóng to toàn cảnh hồ" (Zoom to Lake Extent) điều khiển OpenLayers Map tự động fit khung nhìn bao quát trọn vẹn lòng hồ.
 */

import React from 'react';
import { Database, Droplets, Info, Layers, ShieldCheck, ZoomIn } from 'lucide-react';
import { Map } from 'ol';
import { getLakeClassification, zoomToLake, type LakeFeatureProps } from '../../../models/lakeModel';

interface LakePopupContentViewProps {
  props: LakeFeatureProps;
  map: Map | null;
  coordinate?: number[];
}

const LakePopupContentView: React.FC<LakePopupContentViewProps> = ({ props, map, coordinate }) => {
  const lakeName = props.name || props.Ten || props.ten || props.Vietnamese;
  const osmId = props.osm_id || props.fid;
  const fclass = props.fclass || 'water';
  const code = props.code || 8200;

  const classification = getLakeClassification(fclass, code);

  const handleZoomToLake = () => {
    zoomToLake(map, coordinate, props.boundedBy);
  };

  return (
    <div className="lake-popup-content space-y-2">
      {lakeName ? (
        <div className="info-row">
          <Droplets size={14} className="text-sky-500 flex-shrink-0" />
          <span>Tên hồ / mặt nước: <strong>{lakeName}</strong></span>
        </div>
      ) : (
        <div className="info-row">
          <Droplets size={14} className="text-sky-400 flex-shrink-0" />
          <span className="text-gray-500 italic">Mặt nước chưa gán tên định danh</span>
        </div>
      )}

      <div className="info-row">
        <Layers size={14} className="text-blue-500 flex-shrink-0" />
        <span>Phân loại thủy vực: <strong style={{ color: classification.color }}>{classification.label}</strong></span>
      </div>

      {osmId && (
        <div className="info-row">
          <Database size={14} className="text-blue-500 flex-shrink-0" />
          <span>Mã định danh OSM: <strong>#{osmId}</strong></span>
        </div>
      )}

      {props.code && (
        <div className="info-row">
          <Info size={14} className="text-blue-500 flex-shrink-0" />
          <span>Mã chuyên đề GIS: <strong>{code}</strong></span>
        </div>
      )}

      {/* Mô tả công năng & ý nghĩa thủy văn */}
      <div className="lake-desc-box mt-2 p-2 bg-sky-50/80 border border-sky-200/70 rounded-md text-[11px] leading-relaxed text-sky-900">
        <div className="font-semibold text-sky-950 mb-0.5 flex items-center gap-1">
          <ShieldCheck size={13} className="text-sky-600" />
          <span>Đặc điểm & Chức năng sinh thái:</span>
        </div>
        <p className="text-gray-700">{classification.desc}</p>

        {classification.functions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {classification.functions.map((func, i) => (
              <span key={i} className="px-1.5 py-0.5 text-[10px] font-medium bg-white/80 text-sky-800 border border-sky-300/50 rounded shadow-2xs">
                • {func}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Nút hành động phóng to lòng hồ */}
      {map && coordinate && (
        <div className="pt-1.5 flex justify-end">
          <button
            onClick={handleZoomToLake}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 border border-sky-300/60 rounded-md transition-all cursor-pointer shadow-2xs"
            title="Phóng to khung nhìn bao quát hồ này"
          >
            <ZoomIn size={13} />
            <span>Phóng to hồ</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LakePopupContentView;
