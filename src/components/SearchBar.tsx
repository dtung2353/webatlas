import React, { useState, useEffect } from 'react';
import { useMapContext } from './MapContext';
import { Search, MapPin } from 'lucide-react';
import { fromLonLat } from 'ol/proj';
import { getCenter } from 'ol/extent';

const SearchBar: React.FC = () => {
  const { map, setPopupData } = useMapContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [defaultDams, setDefaultDams] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://overuse-dictator-appear.ngrok-free.dev/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=webatlas:thuydienvietnam%20%E2%80%94%20hydropower_2020&outputFormat=application/json', {
      headers: { 'ngrok-skip-browser-warning': '1' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setDefaultDams(data.features.slice(0, 10)); // Default show first 10 dams
        }
      })
      .catch(err => console.error('Error loading hydropower data for search:', err));
  }, []);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      setResults(defaultDams);
    } else {
      const searchRes = searchFeatures(val);
      setResults(searchRes);
    }
  };

  const flyTo = (feature: any) => {
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

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper glass-panel">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Tìm kiếm tỉnh, xã phường, đập, trạm quan trắc..." 
          value={query}
          onChange={handleSearch}
          onFocus={() => {
            setShowResults(true);
            if (query.trim() === '') setResults(defaultDams);
          }}
          className="search-input"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results glass-panel">
          {results.map((item: any, idx: number) => {
            const isOlFeature = typeof item.getProperties === 'function';
            const props = isOlFeature ? item.getProperties() : item.properties;
            
            const displayName = props.NAME_3 || props.NAME_1 || props.Vietnamese || props.name || props.Ten || 'Không tên';
            let typeDesc = 'Địa điểm';
            if (props.Wattage_PL !== undefined) typeDesc = `Thủy điện ${props.Wattage_PL} MW`;
            else if (props.NAME_3) typeDesc = `Xã/Phường, ${props.NAME_2 || ''} ${props.NAME_1 || ''}`;
            else if (props.NAME_1) typeDesc = 'Tỉnh/Thành phố';
            else if (props.value !== undefined || props.type) typeDesc = props.type || 'Trạm quan trắc';

            return (
                <button 
                  key={idx}
                  className="search-result-item"
                  onClick={() => flyTo(item)}
                >
                  <MapPin size={16} className="text-blue-500" />
                  <div className="result-info">
                    <span className="result-name">{displayName}</span>
                    <span className="result-desc">{typeDesc}</span>
                  </div>
                </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
