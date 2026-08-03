/**
 * @file SearchBarView.tsx
 * @directory src/views/search
 * @description View hiển thị thanh tìm kiếm địa danh và đối tượng không gian (Search Bar View Component).
 * 
 * Chức năng chính: Thanh Tìm kiếm Đối tượng & Định vị (Spatial Search Bar View)
 * Các chức năng nhỏ:
 * - Nhập từ khóa tìm kiếm Tỉnh, Xã/Phường, Đập thủy điện, Trạm quan trắc.
 * - Danh sách hiển thị kết quả gợi ý danh sách đối tượng khớp từ khóa.
 * - Tự động gọi Controller định vị và bay (flyTo) bản đồ tới đối tượng được chọn.
 */

import React from 'react';
import { useSearchController } from '../../controllers/useSearchController';
import { Search, MapPin } from 'lucide-react';

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

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper glass-panel">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Tìm kiếm tỉnh, xã phường, đập, trạm quan trắc..." 
          value={query}
          onChange={handleSearchChange}
          onFocus={() => {
            setShowResults(true);
          }}
          className="search-input"
        />
      </div>

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
                onClick={() => flyToFeature(item)}
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

export default SearchBarView;
