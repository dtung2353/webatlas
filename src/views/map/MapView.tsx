/**
 * @file MapView.tsx
 * @directory src/views/map
 * @description View hiển thị bản đồ chính OpenLayers (Core OpenLayers Map View Component).
 * 
 * Chức năng chính: Khung Giao diện Bản đồ Chính (Core Map View Display)
 * Các chức năng nhỏ:
 * - Khởi tạo canvas bản đồ OpenLayers với View mặc định cho Duyên hải Nam Trung Bộ & Tây Nguyên.
 * - Khởi tạo các lớp WMS MapServer (diaphantinh, gadm41_vnm_3, thuydienvietnam, thuyhe).
 * - Khởi tạo các lớp Vector GeoJSON mô phỏng (Trạm quan trắc, Ngập lụt, Hạn hán, Xâm nhập mặn, Vùng sinh lũ).
 * - Tự động cập nhật hiển thị các lớp ranh giới theo mức phóng to (Zoom LOD).
 * - Truy vấn WFS và vẽ hiệu ứng phát sáng (Highlight) cho sông và các phụ lưu cùng lưu vực.
 */

import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import { useMapController } from '../../controllers/useMapController';
import { 
  stationsMockData,
  floodMockData,
  droughtSurveyMockData,
  saltwaterIntrusionMockData,
  floodGenerationMockData
} from '../../models/mockData';
import { parseGMLCoordinates } from '../../models/gmlParser';
import { MAPSERVER_URL } from '../../shared/config/mapServer';
import { MapServerService } from '../../services/MapServerService';

const MapView: React.FC = () => {
  const mapElement = useRef<HTMLDivElement>(null);
  const { setMap, basemap, layersState, reservoirFilter, popupData, highlightedRiverBasin } = useMapController();
  const mapRef = useRef<Map | null>(null);

  const basemapLayerRef = useRef<TileLayer<XYZ> | null>(null);
  const layersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!mapElement.current) return;

    // 1. Khởi tạo Basemap Layer (CartoDB Positron No Labels)
    const initialBasemap = new TileLayer({
      className: 'basemap-tile-layer',
      source: new XYZ({
        url: 'https://{a-d}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        attributions: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20
      }),
    });
    basemapLayerRef.current = initialBasemap;

    // Helper tạo WMS Tile Layer từ MapServer
    const createWMSLayer = (id: string, layerName: string, options: any = {}) => {
      const layer = new TileLayer({
        source: new TileWMS({
          url: MAPSERVER_URL,
          params: {
            'LAYERS': layerName,
            'TILED': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true
          },
          serverType: 'mapserver',
          crossOrigin: 'anonymous',
        }),
        properties: { id },
        ...options
      });
      layersRef.current[id] = layer;
      return layer;
    };

    // Helper tạo Vector Layer từ GeoJSON
    const createVectorLayer = (id: string, data: any, style: any) => {
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(data, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
      });
      const layer = new VectorLayer({
        source,
        style,
        properties: { id }
      });
      layersRef.current[id] = layer;
      return layer;
    };

    const stationsStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: '#10b981' }),
        stroke: new Stroke({ color: '#ffffff', width: 1.5 })
      })
    });

    const floodStyle = new Style({
      fill: new Fill({ color: 'rgba(239, 68, 68, 0.25)' }),
      stroke: new Stroke({ color: '#ef4444', width: 1.5 })
    });

    const droughtSurveyStyle = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#b45309' }),
        stroke: new Stroke({ color: '#ffffff', width: 1.5 })
      })
    });

    const saltwaterIntrusionStyle = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#7c3aed' }),
        stroke: new Stroke({ color: '#ffffff', width: 1.5 })
      })
    });

    const floodGenerationStyle = new Style({
      fill: new Fill({ color: 'rgba(79, 70, 229, 0.2)' }),
      stroke: new Stroke({ color: '#4f46e5', width: 1.5 })
    });

    // 2. Tạo WMS Layers từ MapServer local & Vector layers
    const lakesLayer = createWMSLayer('layer_lakes', 'ho_mat_nuoc');
    const roadsLayer = createWMSLayer('layer_roads', 'giao_thong_duong_di');
    const railwaysLayer = createWMSLayer('layer_railways', 'duong_sat_viet_nam');
    const residentialLayer = createWMSLayer('layer_residential', 'dia_diem_dan_cu');
    const damsLayer = createWMSLayer('layer_dams', 'thuydienvietnam');
    const riversLayer = createWMSLayer('layer_rivers', 'thuyhe');
    const stationsLayer = createVectorLayer('layer_stations', stationsMockData, stationsStyle);
    const floodLayer = createVectorLayer('layer_flood', floodMockData, floodStyle);
    const droughtSurveyLayer = createVectorLayer('layer_drought_survey', droughtSurveyMockData, droughtSurveyStyle);
    const saltwaterIntrusionLayer = createVectorLayer('layer_saltwater_intrusion', saltwaterIntrusionMockData, saltwaterIntrusionStyle);
    const floodGenerationLayer = createVectorLayer('layer_flood_generation', floodGenerationMockData, floodGenerationStyle);

    const provincesLayer = createWMSLayer('layer_provinces_2026', 'diaphantinh,diaphantinh_label');
    const wardsLayer = createWMSLayer('layer_wards_2026', 'gadm41_vnm_3');

    // Layer highlight sông phát sáng
    const riverHighlightSource = new VectorSource();
    const riverHighlightLayer = new VectorLayer({
      source: riverHighlightSource,
      style: [
        new Style({ stroke: new Stroke({ color: 'rgba(239, 68, 68, 0.85)', width: 10 }) }),
        new Style({ stroke: new Stroke({ color: '#fde047', width: 4.5 }) })
      ],
      properties: { id: 'river_highlight' }
    });
    layersRef.current['river_highlight_source'] = riverHighlightSource;

    // 3. Khởi tạo thể hiện Map
    const map = new Map({
      target: mapElement.current,
      layers: [
        initialBasemap, 
        provincesLayer,
        wardsLayer,
        lakesLayer,
        floodLayer,
        riversLayer,
        roadsLayer,
        railwaysLayer,
        residentialLayer,
        damsLayer,
        stationsLayer,
        droughtSurveyLayer,
        saltwaterIntrusionLayer,
        floodGenerationLayer,
        riverHighlightLayer
      ],
      view: new View({
        center: fromLonLat([108.4, 13.6]),
        zoom: 6.5,
        minZoom: 5.5,
        maxZoom: 20,
        extent: transformExtent([101.0, 8.0, 110.0, 23.5], 'EPSG:4326', 'EPSG:3857'),
      }),
      controls: []
    });

    mapRef.current = map;
    setMap(map);

    return () => {
      map.setTarget(undefined);
    };
  }, [setMap]);

  // Cập nhật nguồn dữ liệu Basemap khi đổi Basemap
  useEffect(() => {
    if (!basemapLayerRef.current) return;
    
    let newSource;
    switch (basemap) {
      case 'satellite':
        newSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19
        });
        break;
      case 'dem':
        newSource = new XYZ({
          url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA',
          maxZoom: 15
        });
        break;
      case 'street':
      default:
        newSource = new XYZ({
          url: 'https://{a-d}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
          attributions: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 20
        });
        break;
    }
    basemapLayerRef.current.setSource(newSource);
  }, [basemap]);

  // Lắng nghe thay đổi LayerState và zoom/pan để cập nhật hiển thị ranh giới
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    const updateLayersVisibility = () => {
      const zoom = map.getView().getZoom();
      const currentZoom = zoom !== undefined ? zoom : 7;
      
      layersState.forEach(state => {
        const layer = layersRef.current[state.id];
        if (layer) {
          let zoomVisible = true;
          if (state.id === 'layer_provinces_2026') {
            zoomVisible = true;
          } else if (state.id === 'layer_wards_2026') {
            zoomVisible = currentZoom >= 8.5;
          }
          
          layer.setVisible(state.visible && zoomVisible);
          layer.setOpacity(state.opacity);
        }
      });
    };

    updateLayersVisibility();
    map.on('moveend', updateLayersVisibility);
    return () => {
      map.un('moveend', updateLayersVisibility);
    };
  }, [layersState]);

  // Vẽ lại layer đập hồ chứa khi thay đổi bộ lọc
  useEffect(() => {
    const damsLayer = layersRef.current['layer_dams'];
    if (damsLayer) {
      damsLayer.changed();
    }
  }, [reservoirFilter]);

  // Highlight sông được click hoặc sông thuộc lưu vực liên quan
  useEffect(() => {
    const highlightSource = layersRef.current['river_highlight_source'];
    if (!highlightSource) return;

    highlightSource.clear();
    if (!popupData) return;

    const props = popupData.feature;
    const isRiver = props && (
      (props._layerName && (props._layerName.includes('thuyhe') || props._layerName.includes('song'))) || 
      props.OBJECTID || props.Chieu_dai || props.chieu_dai || props.Cap || props.cap
    );

    if (isRiver && popupData.coordinate) {
      const fetchRiverGeometry = async () => {
        try {
          const [lon, lat] = toLonLat(popupData.coordinate);
          const delta = 0.08;
          const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
          const wfsUrl = MapServerService.buildUrl(`SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=thuyhe&OUTPUTFORMAT=gml2&BBOX=${bbox}&MAXFEATURES=10`);

          const response = await fetch(wfsUrl);
          if (response.ok) {
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const members = xmlDoc.getElementsByTagName('gml:featureMember');

            for (let i = 0; i < members.length; i++) {
              const member = members[i];
              const lineString = member.getElementsByTagName('gml:LineString')[0];
              if (lineString) {
                const coordsEl = lineString.getElementsByTagName('gml:coordinates')[0];
                if (coordsEl && coordsEl.textContent) {
                  const points = parseGMLCoordinates(coordsEl.textContent);
                  if (points.length >= 2) {
                    const feature = new Feature({ geometry: new LineString(points) });
                    highlightSource.addFeature(feature);
                  }
                }
              }
            }
          }
        } catch (err) {
          console.warn('Lỗi tải geometry sông cho highlight:', err);
        }
      };
      fetchRiverGeometry();
    }

    if (highlightedRiverBasin && popupData.coordinate) {
      const fetchAllRelatedRivers = async () => {
        try {
          const [lon, lat] = toLonLat(popupData.coordinate);
          const delta = 0.6;
          const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
          const wfsUrl = MapServerService.buildUrl(`SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=thuyhe&OUTPUTFORMAT=gml2&BBOX=${bbox}&MAXFEATURES=150`);

          const response = await fetch(wfsUrl);
          if (response.ok) {
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const members = xmlDoc.getElementsByTagName('gml:featureMember');

            for (let i = 0; i < members.length; i++) {
              const member = members[i];
              const lineString = member.getElementsByTagName('gml:LineString')[0];
              if (lineString) {
                const coordsEl = lineString.getElementsByTagName('gml:coordinates')[0];
                if (coordsEl && coordsEl.textContent) {
                  const points = parseGMLCoordinates(coordsEl.textContent);
                  if (points.length >= 2) {
                    const feature = new Feature({ geometry: new LineString(points) });
                    highlightSource.addFeature(feature);
                  }
                }
              }
            }
          }
        } catch (err) {
          console.warn('Lỗi tải sông liên quan:', err);
        }
      };
      fetchAllRelatedRivers();
    }
  }, [popupData, highlightedRiverBasin]);

  return (
    <div ref={mapElement} className={`map-container basemap-${basemap}`} />
  );
};

export default MapView;
