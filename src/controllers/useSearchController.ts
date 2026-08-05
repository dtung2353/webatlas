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

  // Tải danh sách các đập thủy điện từ MapServer WFS (GML format)
  useEffect(() => {
    const wfsUrl = buildMapServerUrl('SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=thuydienvietnam&MAXFEATURES=50');
    
    fetch(wfsUrl)
      .then(res => res.text())
      .then(xmlText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const members = xmlDoc.getElementsByTagName('gml:featureMember');
        const dams: any[] = [];
        
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          const featureEl = member.firstElementChild;
          if (featureEl) {
            const props: Record<string, any> = {};
            let lon = 0;
            let lat = 0;

            const children = featureEl.children;
            for (let j = 0; j < children.length; j++) {
              const child = children[j];
              const tagName = child.tagName.replace(/^.*:/, '');

              if (tagName === 'Point' || tagName === 'msGeometry') {
                const coordsEl = child.getElementsByTagName('gml:coordinates')[0];
                if (coordsEl && coordsEl.textContent) {
                  const parts = coordsEl.textContent.trim().split(',');
                  if (parts.length >= 2) {
                    lon = parseFloat(parts[0]);
                    lat = parseFloat(parts[1]);
                  }
                }
              } else if (child.children.length === 0 && child.textContent !== null) {
                props[tagName] = child.textContent.trim();
              }
            }

            if (props.X && props.Y) {
              lon = parseFloat(props.X) || lon;
              lat = parseFloat(props.Y) || lat;
            }

            const name = props.Vietnamese || props.English_hy || props.name || props.Ten || `Đập thủy điện ${props.ID || (i + 1)}`;
            props.name = name;

            if (lon && lat) {
              dams.push({
                geometry: {
                  type: 'Point',
                  coordinates: [lon, lat]
                },
                properties: props
              });
            }
          }
        }
        
        if (dams.length > 0) {
          setDefaultDams(dams);
          setResults(dams);
        }
      })
      .catch(err => {
        console.warn('Lỗi kết nối MapServer WFS cho ô tìm kiếm:', err);
      });
  }, []);

  /** Tìm kiếm đối tượng theo từ khóa */
  const searchFeatures = (val: string) => {
    if (val.trim() === '') return [];
    const normVal = val.toLowerCase();
    const found: any[] = [];

    // 1. Tìm trong danh sách đập thủy điện đã tải từ WFS
    defaultDams.forEach(dam => {
      const p = dam.properties || {};
      const name = (p.Vietnamese || p.English_hy || p.name || '').toLowerCase();
      if (name.includes(normVal)) {
        found.push(dam);
      }
    });

    // 2. Tìm trong các lớp vector trên bản đồ
    if (map) {
      const layers = map.getLayers().getArray();
      layers.forEach(layer => {
        if (typeof (layer as any).getSource === 'function') {
          const source = (layer as any).getSource();
          if (source && typeof source.getFeatures === 'function') {
            const features = source.getFeatures();
            features.forEach((feat: any) => {
              const props = feat.getProperties();
              const name1 = (props.NAME_1 || '').toLowerCase();
              const name3 = (props.NAME_3 || '').toLowerCase();
              const vnName = (props.Vietnamese || '').toLowerCase();
              const enName = (props.English_hy || '').toLowerCase();
              const name = (props.name || props.Ten || '').toLowerCase();

              if (
                name1.includes(normVal) ||
                name3.includes(normVal) ||
                vnName.includes(normVal) ||
                enName.includes(normVal) ||
                name.includes(normVal)
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
    }

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
    } else if (feature.geometry && feature.geometry.coordinates) {
      coordinate = fromLonLat(feature.geometry.coordinates);
      props = feature.properties;
      
      map.getView().animate({
        center: coordinate,
        zoom: 12,
        duration: 1000
      });
    }

    if (coordinate && props) {
      setPopupData({
        coordinate: coordinate,
        feature: props
      });
    }
    
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
