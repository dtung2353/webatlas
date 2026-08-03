/**
 * @file useSearchController.ts
 * @directory src/controllers
 * @description Controller điều khiển logic tìm kiếm đối tượng địa lý và định vị vị trí trên bản đồ.
 * 
 * Chức năng chính: Controller Tìm kiếm & Định vị Tự động (Spatial Search & Navigation Controller)
 * Các chức năng nhỏ:
 * - Khởi tạo danh sách đập thủy điện mặc định từ MapServer WFS.
 * - Lọc và tìm kiếm các đối tượng theo từ khóa người dùng nhập trên các lớp vector/WMS.
 * - Điều khiển góc nhìn bản đồ (flyTo & animate zoom) và mở Cửa sổ Popup tương ứng.
 */

import { useState, useEffect } from 'react';
import { useMapController } from './useMapController';
import { fromLonLat } from 'ol/proj';
import { getCenter } from 'ol/extent';
import { buildMapServerUrl } from '../models/appConfig';

export const useSearchController = () => {
  const { map, setPopupData } = useMapController();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [defaultDams, setDefaultDams] = useState<any[]>([]);

  // Tải danh sách các đập thủy điện mặc định từ MapServer WFS
  useEffect(() => {
    const wfsUrl = buildMapServerUrl('SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=thuydienvietnam&OUTPUTFORMAT=geojson&MAXFEATURES=10');
    
    fetch(wfsUrl)
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setDefaultDams(data.features.slice(0, 10));
        }
      })
      .catch(err => {
        console.warn('Lỗi kết nối MapServer WFS cho ô tìm kiếm, chuyển sang dữ liệu mặc định:', err);
      });
  }, []);

  /** Tìm kiếm trong các tính năng của các lớp bản đồ hiện tại */
  const searchFeatures = (val: string) => {
    if (!map || val.trim() === '') return [];
    const layers = map.getLayers().getArray();
    const found: any[] = [];
    const normVal = val.toLowerCase();
    
    layers.forEach(layer => {
      if (typeof (layer as any).getSource === 'function') {
        const source = (layer as any).getSource();
        if (source && typeof source.getFeatures === 'function') {
          const features = source.getFeatures();
          features.forEach((feat: any) => {
            const props = feat.getProperties();
            const name1 = props.NAME_1 || '';
            const name3 = props.NAME_3 || '';
            const vnName = props.Vietnamese || '';
            const enName = props.English_hy || '';
            const name = props.name || props.Ten || '';

            if (
              name1.toLowerCase().includes(normVal) ||
              name3.toLowerCase().includes(normVal) ||
              vnName.toLowerCase().includes(normVal) ||
              enName.toLowerCase().includes(normVal) ||
              name.toLowerCase().includes(normVal)
            ) {
              const uid = feat.ol_uid;
              const hasDuplicate = found.some(f => f.ol_uid === uid);
              if (!hasDuplicate) {
                found.push(feat);
              }
            }
          });
        }
      }
    });
    return found.slice(0, 50);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      setResults(defaultDams);
    } else {
      const searchRes = searchFeatures(val);
      setResults(searchRes);
    }
  };

  /** Di chuyển góc nhìn bản đồ tới đối tượng được chọn */
  const flyToFeature = (feature: any) => {
    if (!map) return;
    
    let coordinate;
    let props;
    
    if (typeof feature.getGeometry === 'function') {
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      const extent = geometry.getExtent();
      coordinate = getCenter(extent);
      props = feature.getProperties();
      
      map.getView().animate({
        center: coordinate,
        zoom: type === 'Point' ? 14 : 11,
        duration: 1000
      });
    } else {
      coordinate = fromLonLat(feature.geometry.coordinates);
      props = feature.properties;
      
      map.getView().animate({
        center: coordinate,
        zoom: 11,
        duration: 1000
      });
    }

    setPopupData({
      coordinate: coordinate,
      feature: props
    });
    
    setShowResults(false);
  };

  return {
    query,
    setQuery,
    results,
    showResults,
    setShowResults,
    defaultDams,
    handleSearchChange,
    flyToFeature
  };
};
