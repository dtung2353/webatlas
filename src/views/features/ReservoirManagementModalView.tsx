/**
 * @file ReservoirManagementModalView.tsx
 * @directory src/views/features
 * @description Thành phần View Modal quản lý hồ chứa & đập thủy điện/thủy lợi khu vực Nam Trung Bộ & Tây Nguyên.
 * 
 * Kiến trúc MVC: View Component (Feature Modal View)
 * 
 * Chi tiết các chức năng:
 * 1. Bảng dữ liệu đập & hồ chứa: Tổng hợp dung tích thiết kế (m³), công suất phát điện (MW), tỉnh/thành vị trí và trạng thái vận hành real-time.
 * 2. Bộ lọc trạng thái & Tìm kiếm: Lọc đập theo từ khóa tìm kiếm tên đập và trạng thái (Tất cả, Bình thường, Đang xả lũ).
 * 3. Tương tác bản đồ: Nhấp chọn đập trong bảng để tự động bay (FlyTo / Zoom) đến vị trí tọa độ địa lý đập trên bản đồ OpenLayers.
 */

import React, { useState } from 'react';
import { X, Database, Search } from 'lucide-react';
import { useMapController } from '../../controllers/useMapController';
import { fromLonLat } from 'ol/proj';

interface ReservoirManagementModalViewProps {
  onClose: () => void;
}

export const ReservoirManagementModalView: React.FC<ReservoirManagementModalViewProps> = ({ onClose }) => {
  const { map } = useMapController();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const damsList = [
    { name: 'Thủy điện Sông Hinh', province: 'Phú Yên', capacity: '70 MW', volume: '357 Triệu m³', status: 'Bình thường', coords: [109.1, 12.9] },
    { name: 'Thủy điện Sông Ba Hạ', province: 'Phú Yên', capacity: '220 MW', volume: '166 Triệu m³', status: 'Xả lũ', coords: [108.9, 13.1] },
    { name: 'Thủy điện An Khê - Kanak', province: 'Gia Lai', capacity: '160 MW', volume: '293 Triệu m³', status: 'Bình thường', coords: [108.6, 13.9] },
    { name: 'Thủy điện Yali', province: 'Gia Lai / Kon Tum', capacity: '720 MW', volume: '1.03 Tỷ m³', status: 'Bình thường', coords: [107.8, 14.2] },
    { name: 'Hồ chứa Định Bình', province: 'Bình Định', capacity: 'Thủy lợi', volume: '226 Triệu m³', status: 'Bình thường', coords: [108.8, 14.1] },
    { name: 'Thủy điện Vĩnh Sơn', province: 'Bình Định', capacity: '66 MW', volume: '135 Triệu m³', status: 'Bình thường', coords: [108.7, 14.3] }
  ];

  const filteredDams = damsList.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'xa_lu' ? d.status === 'Xả lũ' : d.status === 'Bình thường');
    return matchSearch && matchStatus;
  });

  const handleFlyToDam = (coords: number[]) => {
    if (!map) return;
    map.getView().animate({
      center: fromLonLat(coords),
      zoom: 12,
      duration: 800
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal glass-panel max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <Database className="text-emerald-500" size={20} />
            <h3 className="text-base font-semibold text-gray-800">Quản lý Hồ chứa & Đập Thủy điện / Thủy lợi</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="search-input-wrapper glass-panel flex-1 max-w-md">
              <Search className="search-icon text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên đập, tỉnh thành..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button 
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filterStatus === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/50 text-gray-700 border-gray-200'}`}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả ({damsList.length})
              </button>
              <button 
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${filterStatus === 'xa_lu' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white/50 text-gray-700 border-gray-200'}`}
                onClick={() => setFilterStatus('xa_lu')}
              >
                Đang xả lũ (1)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200">
                  <th className="p-2.5 font-semibold">Tên Công trình Đập</th>
                  <th className="p-2.5 font-semibold">Địa bàn Tỉnh</th>
                  <th className="p-2.5 font-semibold">Công suất Thiết kế</th>
                  <th className="p-2.5 font-semibold">Dung tích Hồ chứa</th>
                  <th className="p-2.5 font-semibold">Trạng thái Vận hành</th>
                  <th className="p-2.5 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDams.map((dam, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-2.5 font-medium text-gray-800">{dam.name}</td>
                    <td className="p-2.5 text-gray-600">{dam.province}</td>
                    <td className="p-2.5 font-semibold text-blue-600">{dam.capacity}</td>
                    <td className="p-2.5 text-gray-700">{dam.volume}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${dam.status === 'Xả lũ' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {dam.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button 
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded font-medium text-[11px]"
                        onClick={() => handleFlyToDam(dam.coords)}
                      >
                        Định vị bản đồ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservoirManagementModalView;
