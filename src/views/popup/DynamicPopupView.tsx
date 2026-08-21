/**
 * @file DynamicPopupView.tsx
 * @directory src/views/popup
 * @description View hiển thị cửa sổ Popup thông tin động khi nhấp chọn bất kỳ đối tượng nào trên bản đồ (Dynamic Popup View Component).
 * 
 * Chức năng chính: Khung Cửa sổ Popup Động (Dynamic Popup Display View)
 * Các chức năng nhỏ:
 * - Lắng nghe click/pointermove trên MapView.
 * - Gửi GetFeatureInfo WMS tới MapServer và phân tích kết quả trả về.
 * - Định vị vị trí pixel động trên màn hình, tự căn chỉnh không bị tràn viền màn hình.
 * - Điều hướng hiển thị sub-view phù hợp (Đập, Sông, Hành chính, Trạm/Hiểm họa).
 * - Kích hoạt Modal chuyên sâu xem thông số an toàn đập.
 */

import React, { useEffect, useState } from 'react';
import { useMapController } from '../../controllers/useMapController';
import { buildMapServerUrl } from '../../models/appConfig';
import { X, Info } from 'lucide-react';
import { toLonLat } from 'ol/proj';
import { parseGMLResponse } from '../../models/gmlPopupParser';
import { getDetailedDamInfo } from '../../models/damDetailHelper';
import DamDetailModalView from './DamDetailModalView';
import DamPopupContentView from './sub-popups/DamPopupContentView';
import LakePopupContentView from './sub-popups/LakePopupContentView';
import RiverPopupContentView from './sub-popups/RiverPopupContentView';
import AdminPopupContentView from './sub-popups/AdminPopupContentView';
import GenericPopupContentView from './sub-popups/GenericPopupContentView';

const DynamicPopupView: React.FC = () => {
  const { map, reservoirFilter, setReservoirFilter, popupData, setPopupData, highlightedRiverBasin, setHighlightedRiverBasin } = useMapController();
  const [pixel, setPixel] = useState<number[]>([0, 0]);
  const [detailedDam, setDetailedDam] = useState<any | null>(null);

  // Cập nhật vị trí Pixel trên màn hình tương ứng với tọa độ bản đồ khi pan/zoom
  useEffect(() => {
    if (!map || !popupData) return;
    
    const updatePixel = () => {
      const px = map.getPixelFromCoordinate(popupData.coordinate);
      if (px) setPixel(px);
    };

    updatePixel();
    map.on('postrender', updatePixel);
    return () => map.un('postrender', updatePixel);
  }, [map, popupData]);

  // Reset chi tiết đập khi đổi popupData
  useEffect(() => {
    setDetailedDam(null);
  }, [popupData]);

  // Lắng nghe sự kiện click trên bản đồ
  useEffect(() => {
    if (!map) return;

    const clickHandler = async (e: any) => {
      // 1. Kiểm tra đối tượng Vector layer
      const vectorFeature = map.forEachFeatureAtPixel(e.pixel, (f: any) => f);
      
      if (vectorFeature) {
        setPopupData({
          coordinate: e.coordinate,
          feature: vectorFeature.getProperties()
        });
        map.getView().animate({ center: e.coordinate, duration: 400 });
        setHighlightedRiverBasin(null);
        return;
      }

      // 2. Truy vấn GetFeatureInfo WMS từ MapServer
      const wmsLayerNames = [
        'thuydienvietnam', 
        'dia_diem_dan_cu',
        'ho_mat_nuoc', 
        'duong_sat_viet_nam',
        'giao_thong_duong_di',
        'thuyhe', 
        'hochua_thuyloi', 
        'danhsachhochua', 
        'diaphantinh', 
        'gadm41_vnm_3'
      ];
      const view = map.getView();
      const size = map.getSize();
      
      if (size) {
        const extent = view.calculateExtent(size);
        const [width, height] = size;
        const x = Math.round(e.pixel[0]);
        const y = Math.round(e.pixel[1]);
        const bbox = `${extent[0]},${extent[1]},${extent[2]},${extent[3]}`;
        const srs = view.getProjection().getCode();

        for (const layerName of wmsLayerNames) {
          try {
            const wmsUrl = buildMapServerUrl(`SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=${layerName}&QUERY_LAYERS=${layerName}&INFO_FORMAT=application/vnd.ogc.gml&X=${x}&Y=${y}&WIDTH=${width}&HEIGHT=${height}&SRS=${srs}&BBOX=${bbox}&FEATURE_COUNT=1`);

            const response = await fetch(wmsUrl);
            if (response.ok) {
              const text = await response.text();
              const props = parseGMLResponse(text);
              if (props) {
                setPopupData({
                  coordinate: e.coordinate,
                  feature: props
                });
                map.getView().animate({ center: e.coordinate, duration: 400 });
                setHighlightedRiverBasin(null);
                return;
              }
            }
          } catch {
            // Tiếp tục lớp tiếp theo
          }
        }
      }

      // 3. Dự phòng hiển thị tọa độ nhấp
      const [lon, lat] = toLonLat(e.coordinate);
      setPopupData({
        coordinate: e.coordinate,
        feature: {
          type: 'Vị trí địa lý',
          name: `Tọa độ: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`,
          latitude: lat.toFixed(4),
          longitude: lon.toFixed(4),
          coordinateText: `${lon.toFixed(4)}°E, ${lat.toFixed(4)}°N`
        }
      });
      setHighlightedRiverBasin(null);
    };

    map.on('singleclick', clickHandler);
    
    const pointerMoveHandler = (e: any) => {
      const hit = map.hasFeatureAtPixel(e.pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    };
    
    map.on('pointermove', pointerMoveHandler);

    return () => {
      map.un('singleclick', clickHandler);
      map.un('pointermove', pointerMoveHandler);
    };
  }, [map, setPopupData, setHighlightedRiverBasin]);

  if (!popupData) return null;

  const props = popupData.feature;

  const isDam = Boolean(
    props.ten_cong_trinh !== undefined || 
    props.cong_suat_mw !== undefined || 
    props.Wattage_PL !== undefined || 
    props.power !== undefined || 
    (props.capacity !== undefined && props.basin !== undefined) || 
    (props._layerName && (props._layerName.includes('thuydien') || props._layerName.includes('dap')))
  );

  const isLake = Boolean(
    !isDam && (
      props.fclass !== undefined || 
      props.water === 'reservoir' || 
      (props._layerName && props._layerName.includes('ho_mat_nuoc'))
    )
  );

  const detail = isDam ? getDetailedDamInfo(
    props.ID || props.id || props.osm_id || props.fid, 
    props.ten_cong_trinh || props.Vietnamese || props.name || props.Ten || 'Đập & Hồ chứa', 
    props.cong_suat_mw || props.Wattage_PL
  ) : null;

  let popupLeft = pixel[0] + 15;
  let popupTop = pixel[1] - 15;
  let xTranslate = '0';
  let yTranslate = '-100%';

  if (popupLeft + 260 > window.innerWidth) {
    popupLeft = pixel[0] - 15;
    xTranslate = '-100%';
  }
  
  if (popupTop - 350 < 0) {
    popupTop = pixel[1] + 15;
    yTranslate = '0';
  }

  const getPopupTitle = (featureProps: Record<string, any>): string => {
    if (!featureProps) return 'Đối tượng không tên';

    // 1. Kiểm tra các trường tên phổ biến
    const directName = 
      featureProps.ten_cong_trinh || 
      featureProps.ten_tram || 
      featureProps.ten_vung || 
      featureProps.ten_diem || 
      featureProps.ten_luu_vuc || 
      featureProps.ten || 
      featureProps.Vietnamese || 
      featureProps.name || 
      featureProps.Ten || 
      featureProps.fullName || 
      featureProps.full_name || 
      featureProps.adm1_name || 
      featureProps.adm1_name1 || 
      featureProps.NAME_3 || 
      featureProps.NAME_2 || 
      featureProps.NAME_1 || 
      featureProps.NAME_0 || 
      featureProps.adm0_name;

    if (directName && typeof directName === 'string' && directName.trim()) {
      return directName.trim();
    }

    // 2. Tìm kiếm thuộc tính dạng chuỗi có chứa tên/name
    for (const [key, value] of Object.entries(featureProps)) {
      if (typeof value === 'string' && value.trim()) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('ten') || lowerKey.includes('name') || lowerKey.includes('label') || lowerKey.includes('title')) {
          return value.trim();
        }
      }
    }

    // 3. Dự phòng tên theo loại lớp dữ liệu
    const layer = String(featureProps._layerName || '').toLowerCase();
    if (layer.includes('thuydien') || layer.includes('hochua') || layer.includes('dap')) {
      return featureProps.fid ? `Công trình Đập & Hồ chứa #${featureProps.fid}` : 'Đập & Hồ chứa Thủy điện';
    }
    if (layer.includes('ho_mat_nuoc') || featureProps.fclass === 'water' || featureProps.fclass === 'reservoir') {
      return featureProps.fid ? `Hồ mặt nước #${featureProps.fid}` : 'Hồ & Mặt nước';
    }
    if (layer.includes('dia_diem_dan_cu') || featureProps.population !== undefined) {
      return featureProps.name || (featureProps.fid ? `Điểm dân cư #${featureProps.fid}` : 'Địa điểm dân cư');
    }
    if (layer.includes('duong_sat')) {
      return featureProps.name || (featureProps.fid ? `Tuyến đường sắt #${featureProps.fid}` : 'Đường sắt Việt Nam');
    }
    if (layer.includes('giao_thong') || featureProps.maxspeed !== undefined || featureProps.oneway !== undefined) {
      return featureProps.name || (featureProps.ref ? `Tuyến đường ${featureProps.ref}` : (featureProps.fid ? `Tuyến đường #${featureProps.fid}` : 'Tuyến giao thông đường bộ'));
    }
    if (layer.includes('thuyhe') || layer.includes('song')) {
      return featureProps.fid ? `Phân đoạn Sông ngòi #${featureProps.fid}` : 'Hệ thống Sông ngòi';
    }
    if (layer.includes('tram')) {
      return featureProps.fid ? `Trạm quan trắc #${featureProps.fid}` : 'Trạm quan trắc Thủy văn';
    }
    if (layer.includes('vung_ngap')) {
      return featureProps.fid ? `Vùng ngập lụt #${featureProps.fid}` : 'Vùng Ngập lụt';
    }
    if (layer.includes('diaphantinh') || layer.includes('gadm') || layer.includes('bien_gioi')) {
      return featureProps.fid ? `Đơn vị Hành chính #${featureProps.fid}` : 'Ranh giới Hành chính';
    }

    if (featureProps.OBJECTID) return `Sông ngòi (ID: ${featureProps.OBJECTID})`;
    if (featureProps.fid) return `Đối tượng (ID: ${featureProps.fid})`;

    return 'Chi tiết đối tượng bản đồ';
  };

  const popupTitle = getPopupTitle(props);

  const renderContent = () => {
    if (isDam) {
      return <DamPopupContentView props={props} reservoirFilter={reservoirFilter} setReservoirFilter={setReservoirFilter} />;
    }
    if (isLake) {
      return <LakePopupContentView props={props} map={map} coordinate={popupData.coordinate} />;
    }
    if (
      props.chieu_dai !== undefined || 
      props.Chieu_dai !== undefined || 
      props.length !== undefined || 
      props.cap !== undefined || 
      (props._layerName && (props._layerName.includes('thuyhe') || props._layerName.includes('song')))
    ) {
      return <RiverPopupContentView props={props} highlightedRiverBasin={highlightedRiverBasin} setHighlightedRiverBasin={setHighlightedRiverBasin} />;
    }
    if (props.truocsn !== undefined || props.NAME_1 !== undefined || (props._layerName && (props._layerName.includes('diaphantinh') || props._layerName.includes('gadm41') || props._layerName.includes('bien_gioi'))) || props.ten_tinh !== undefined) {
      return <AdminPopupContentView props={props} />;
    }
    return <GenericPopupContentView props={props} />;
  };

  return (
    <>
      <div 
        className="dynamic-popup glass-panel"
        style={{
          left: popupLeft,
          top: popupTop,
          transform: `translate(${xTranslate}, ${yTranslate})`,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button 
          className="close-popup-btn" 
          onClick={() => {
            setPopupData(null);
            setHighlightedRiverBasin(null);
          }}
        >
          <X size={16} />
        </button>
        
        <div className="popup-header">
          <h3 className="popup-title">{popupTitle}</h3>
          {props.riskLevel && (
            <span className={`status-badge ${props.riskLevel === 'Cao' ? 'risk-high' : props.riskLevel === 'Trung bình' ? 'risk-medium' : 'risk-low'}`}>
              {props.riskLevel}
            </span>
          )}
        </div>
        
        <div className="popup-content">
          {renderContent()}
        </div>
        
        {isDam && (
          <div className="popup-footer">
            <button className="details-btn" onClick={() => setDetailedDam(props)}>
              <Info size={16} />
              <span>Xem chi tiết chuyên sâu</span>
            </button>
          </div>
        )}
      </div>

      {detailedDam && detail && (
        <DamDetailModalView detail={detail} onClose={() => setDetailedDam(null)} />
      )}
    </>
  );
};

export default DynamicPopupView;
