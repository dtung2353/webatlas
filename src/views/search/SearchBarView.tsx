/**
 * @file SearchBarView.tsx
 * @directory src/views/search
 * @description View hiển thị thanh tìm kiếm ở trung tâm bên trên, kết hợp nút Chức năng Lọc dữ liệu bên cạnh.
 */

import React, { useState } from 'react';
import { useSearchController } from '../../controllers/useSearchController';
import { useMapController } from '../../controllers/useMapController';
import { 
  Search, 
  MapPin, 
  Sliders, 
  X, 
  Database, 
  Droplets, 
  AlertTriangle
} from 'lucide-react';

const BuildingIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/>
  </svg>
);

const WavesIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  </svg>
);

const RadioIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="2"/>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.83a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
  </svg>
);

const CloudRainIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="M16 14v6M8 14v6M12 16v6"/>
  </svg>
);

const SunIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const NavigationIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

const TrainIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="16" x="4" y="3" rx="2"/>
    <path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h.01M16 15h.01"/>
  </svg>
);

const CheckIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const RotateCcwIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

const EyeIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

const SearchBarView: React.FC = () => {
  const {
    query,
    results,
    showResults,
    setShowResults,
    defaultDams,
    handleSearchChange,
    flyToFeature
  } = useSearchController();

  const { layersState, toggleLayerVisibility } = useMapController();

  const [showFilter, setShowFilter] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('Tất cả các tỉnh');

  const provinces = [
    'Tất cả các tỉnh',
    'Bình Định',
    'Phú Yên',
    'Khánh Hòa',
    'Gia Lai',
    'Đắk Lắk',
    'Đắk Nông',
    'Kon Tum',
    'Lâm Đồng'
  ];

  const filterLayers = [
    {
      groupName: 'Ranh giới & Hệ thống Thủy văn',
      layers: [
        { id: 'layer_provinces_2026', label: 'Ranh giới Tỉnh', icon: <BuildingIcon size={14} className="text-blue-600" />, bg: 'bg-blue-50' },
        { id: 'layer_wards_2026', label: 'Ranh giới Xã/Phường', icon: <MapPin size={14} className="text-emerald-600" />, bg: 'bg-emerald-50' },
        { id: 'layer_lakes', label: 'Hồ & Mặt nước', icon: <Droplets size={14} className="text-sky-600" />, bg: 'bg-sky-50' },
        { id: 'layer_rivers', label: 'Hệ thống Sông ngòi', icon: <WavesIcon size={14} className="text-cyan-600" />, bg: 'bg-cyan-50' },
        { id: 'layer_dams', label: 'Đập & Hồ chứa', icon: <Database size={14} className="text-indigo-600" />, bg: 'bg-indigo-50' },
        { id: 'layer_stations', label: 'Trạm quan trắc', icon: <RadioIcon size={14} className="text-purple-600" />, bg: 'bg-purple-50' },
      ]
    },
    {
      groupName: 'Hạ tầng & Dân sinh',
      layers: [
        { id: 'layer_roads', label: 'Giao thông đường bộ', icon: <NavigationIcon size={14} className="text-amber-600" />, bg: 'bg-amber-50' },
        { id: 'layer_railways', label: 'Đường sắt Việt Nam', icon: <TrainIcon size={14} className="text-gray-600" />, bg: 'bg-gray-100' },
        { id: 'layer_residential', label: 'Điểm dân cư & Đô thị', icon: <BuildingIcon size={14} className="text-rose-600" />, bg: 'bg-rose-50' },
      ]
    },
    {
      groupName: 'Cảnh báo Thiên tai & Hiểm họa',
      layers: [
        { id: 'layer_flood', label: 'Vùng ngập lụt', icon: <CloudRainIcon size={14} className="text-sky-600" />, bg: 'bg-sky-50' },
        { id: 'layer_drought_survey', label: 'Vùng hạn hán', icon: <SunIcon size={14} className="text-amber-600" />, bg: 'bg-amber-50' },
        { id: 'layer_saltwater_intrusion', label: 'Xâm nhập mặn', icon: <Droplets size={14} className="text-teal-600" />, bg: 'bg-teal-50' },
        { id: 'layer_flood_generation', label: 'Vùng sinh lũ', icon: <AlertTriangle size={14} className="text-rose-600" />, bg: 'bg-rose-50' },
      ]
    }
  ];

  const allLayers = filterLayers.flatMap(g => g.layers);

  const isLayerVisible = (layerId: string) => {
    return layersState.find(l => l.id === layerId)?.visible ?? false;
  };

  const activeLayersCount = allLayers.filter(l => isLayerVisible(l.id)).length;
  const areAllLayersVisible = allLayers.every(l => isLayerVisible(l.id));

  const toggleAllLayers = () => {
    const targetState = !areAllLayersVisible;
    allLayers.forEach(l => {
      if (isLayerVisible(l.id) !== targetState) {
        toggleLayerVisibility(l.id);
      }
    });
  };

  return (
    <div className="top-center-search-container">
      <div className="search-filter-wrapper flex items-center gap-2">
        {/* Thanh Tìm Kiếm */}
        <div className="search-input-wrapper glass-panel flex-1">
          <Search className="search-icon text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tỉnh, xã/phường, đập, trạm quan trắc..." 
            value={query}
            onChange={handleSearchChange}
            onFocus={() => {
              setShowResults(true);
            }}
            className="search-input"
          />
          {query && (
            <button 
              className="clear-query-btn p-1 hover:bg-gray-200/50 rounded-full cursor-pointer"
              onClick={() => handleSearchChange({ target: { value: '' } } as any)}
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Nút Chức năng Lọc bên cạnh thanh tìm kiếm */}
        <button 
          className={`filter-toggle-btn glass-panel ${showFilter ? 'active' : ''}`}
          onClick={() => setShowFilter(!showFilter)}
          title="Bộ lọc dữ liệu bản đồ"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/15 text-blue-600 transition-all filter-icon-box">
            <Sliders size={13} />
          </div>
          <span className="font-semibold text-xs text-gray-800">Lọc</span>
          {activeLayersCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full shadow-2xs">
              {activeLayersCount}
            </span>
          )}
        </button>
      </div>

      {/* Menu / Panel Chức Năng Lọc Chuẩn Hóa Kích Thước Thống Nhất */}
      {showFilter && (
        <div className="filter-dropdown-panel glass-panel">
          <div className="filter-header flex items-center justify-between pb-2 mb-2 border-b border-gray-200/60">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <Sliders size={12} />
              </div>
              <h4 className="font-bold text-xs text-gray-900 tracking-wide uppercase">Bộ Lọc Dữ Liệu</h4>
            </div>

            <div className="flex items-center gap-1">
              {/* Nút gộp Bật / Tắt tất cả dữ liệu */}
              <button 
                className={`px-2 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer border shadow-2xs ${
                  areAllLayersVisible 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 hover:bg-amber-500/20' 
                    : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-2xs'
                }`}
                onClick={toggleAllLayers}
                title={areAllLayersVisible ? 'Tắt toàn bộ lớp dữ liệu' : 'Bật toàn bộ lớp dữ liệu'}
              >
                {areAllLayersVisible ? (
                  <>
                    <EyeOffIcon size={11} />
                    <span>Tắt tất cả</span>
                  </>
                ) : (
                  <>
                    <EyeIcon size={11} />
                    <span>Bật tất cả</span>
                  </>
                )}
              </button>
              <button 
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100/80 transition-colors cursor-pointer"
                onClick={() => setShowFilter(false)}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="filter-content space-y-2 max-h-[52vh] overflow-y-auto pr-0.5">
            {filterLayers.map((group, idx) => (
              <div key={idx} className="filter-group space-y-1">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider px-0.5">
                  {group.groupName}
                </label>
                <div className="filter-layer-grid">
                  {group.layers.map(layer => {
                    const visible = isLayerVisible(layer.id);
                    return (
                      <button
                        key={layer.id}
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className={`filter-layer-card ${visible ? 'active' : ''}`}
                      >
                        <div className={`layer-icon-badge ${layer.bg}`}>
                          {layer.icon}
                        </div>
                        <div className="layer-title-box">
                          <span className="layer-title-text">{layer.label}</span>
                        </div>
                        <div className={`layer-check-box ${visible ? 'active' : ''}`}>
                          {visible ? <CheckIcon size={10} className="text-white" /> : <EyeOffIcon size={10} className="text-gray-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="filter-section pt-2 border-t border-gray-200/60">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-0.5">
                Phạm vi Tỉnh / Địa bàn
              </label>
              <select 
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="filter-select w-full text-xs p-1.5 rounded-md border border-gray-200/80 bg-white/90 outline-none font-medium text-gray-800 shadow-2xs hover:border-blue-300 transition-all cursor-pointer"
              >
                {provinces.map((prov, i) => (
                  <option key={i} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions flex justify-end gap-1.5 pt-2 border-t border-gray-200/60 mt-2">
            <button 
              className="px-3 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200/80 border border-gray-200/80 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1"
              onClick={() => {
                setSelectedProvince('Tất cả các tỉnh');
              }}
            >
              <RotateCcwIcon size={11} />
              Đặt lại
            </button>
            <button 
              className="px-3.5 py-1 text-xs bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              onClick={() => setShowFilter(false)}
            >
              <X size={11} />
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Kết quả Tìm kiếm gợi ý */}
      {showResults && results.length > 0 && (
        <div className="search-results glass-panel">
          {(query.trim() === '' ? defaultDams : results).map((item: any, idx: number) => {
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
                onClick={() => {
                  flyToFeature(item);
                  setShowResults(false);
                }}
              >
                <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                <div className="result-info text-left">
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

export default SearchBarView;
