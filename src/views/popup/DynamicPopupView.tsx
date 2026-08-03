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
      const wmsLayerNames = ['thuydienvietnam', 'thuyhe', 'diaphantinh', 'gadm41_vnm_3'];
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

  const isDamOrReservoir = props.Wattage_PL !== undefined || (props.capacity !== undefined && props.basin !== undefined);
  const detail = isDamOrReservoir ? getDetailedDamInfo(props.ID || props.id, props.Vietnamese || props.Ten || props.name || 'Đập & Hồ chứa', props.Wattage_PL) : null;

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

  const popupTitle = props.adm1_name || props.ten_tinh || props.NAME_3 || props.NAME_1 || props.Vietnamese || props.Ten || props.name || (props.OBJECTID ? `Sông ngòi (ID: ${props.OBJECTID})` : (props._layerName ? `${props._layerName}` : 'Đối tượng không tên'));

  const renderContent = () => {
    if (isDamOrReservoir) {
      return <DamPopupContentView props={props} reservoirFilter={reservoirFilter} setReservoirFilter={setReservoirFilter} />;
    }
    if (props.Chieu_dai !== undefined || props.length !== undefined || props._layerName === 'thuyhe' || props._layerName === 'song_vietnam') {
      return <RiverPopupContentView props={props} highlightedRiverBasin={highlightedRiverBasin} setHighlightedRiverBasin={setHighlightedRiverBasin} />;
    }
    if (props.truocsn !== undefined || props.NAME_1 !== undefined || props._layerName === 'diaphantinh' || props._layerName === 'gadm41_vnm_3' || props.ten_tinh !== undefined) {
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
        
        {isDamOrReservoir && (
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
