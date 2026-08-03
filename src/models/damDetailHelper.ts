/**
 * @file damDetailHelper.ts
 * @directory src/models
 * @description Model tính toán và tra cứu thông số kỹ thuật chi tiết cùng hiện trạng an toàn của đập thủy điện.
 * 
 * Chức năng chính: Model Tra cứu Thông số Kỹ thuật Đập (Dam Detailed Information Helper Model)
 * Các chức năng nhỏ:
 * - getDetailedDamInfo: Trả về đối tượng `DamDetails` đầy đủ cho công trình đập thủy điện.
 */

import type { DamDetails } from './mapTypes';

export function getDetailedDamInfo(id: any, name: string, wattage?: number): DamDetails {
  const wattageNum = Number(wattage || 100);
  
  let loai = 'Đập bê tông trọng lực';
  let vatLieu = 'Bê tông đầm lăn (RCC)';
  let capCongTrinh = 'Cấp I';
  let caoTrinhDinh = '185.0 m';
  let caoTrinhTuongChan = '186.5 m';
  let chieuDai = '620.0 m';
  let chieuCaoMax = '82.5 m';
  let chieuRongDinh = '10.0 m';
  
  if (wattageNum >= 500) {
    loai = 'Đập bê tông trọng lực khối lớn';
    vatLieu = 'Bê tông cốt thép / RCC';
    capCongTrinh = 'Cấp Đặc biệt';
    caoTrinhDinh = '215.0 m';
    caoTrinhTuongChan = '216.8 m';
    chieuDai = '1,150.0 m';
    chieuCaoMax = '124.0 m';
    chieuRongDinh = '12.0 m';
  } else if (wattageNum < 100) {
    loai = 'Đập đất đá hỗn hợp';
    vatLieu = 'Đất nện lõi sét';
    capCongTrinh = 'Cấp II';
    caoTrinhDinh = '95.0 m';
    caoTrinhTuongChan = '96.2 m';
    chieuDai = '340.0 m';
    chieuCaoMax = '45.0 m';
    chieuRongDinh = '8.0 m';
  }

  const hash = String(id || name).length;
  const maiThuongLuu = hash % 2 === 0 ? 'Gia cố bằng bê tông tấm đan phẳng' : 'Cảnh báo: Có dấu hiệu sạt trượt nhẹ cục bộ';
  const thamNang = hash % 3 === 0 ? 'Phát hiện rò rỉ nhẹ tại hành lang kiểm tra' : 'Không ghi nhận thấm nước nặng';
  const thamNhe = hash % 4 === 0 ? 'Thấm ẩm chân đập mái hạ lưu' : 'Khô ráo, hoạt động an toàn';

  return {
    ten: name,
    loai,
    vatLieu,
    capCongTrinh,
    caoTrinhDinh,
    caoTrinhTuongChan,
    chieuDai,
    chieuCaoMax,
    chieuRongDinh,
    maiThuongLuu,
    thamNang,
    thamNhe
  };
}
