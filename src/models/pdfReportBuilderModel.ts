/**
 * @file pdfReportBuilderModel.ts
 * @directory src/models
 * @description Model tổng hợp dữ liệu, xây dựng cấu trúc HTML template và đóng gói xuất file báo cáo PDF (PDF Report Builder Model).
 * 
 * Chức năng chính: Model Tạo & Xuất Báo cáo PDF (PDF Report Generation Model)
 * Các chức năng nhỏ:
 * - removeVietnameseTones: Chuẩn hóa chuỗi tiếng Việt sang ASCII không dấu để tránh lỗi font khi xuất PDF.
 * - generatePDFReport: Hàm tổng hợp snapshot bản đồ, biểu đồ thống kê, chú giải ký hiệu và bảng thuộc tính hồ chứa xuất thành file `.pdf`.
 */

import { jsPDF } from 'jspdf';
import { Map } from 'ol';
import { getMapSnapshot } from './mapSnapshotModel';
import { createStatusDonutChart, createCapacityBarChart } from './chartGeneratorModel';
import type { LayerState, ExportReportOptions } from './mapTypes';

/**
 * Hàm loại bỏ dấu tiếng Việt (Chuyển sang tiếng Việt không dấu chuẩn ASCII).
 * 
 * @param str Chuỗi tiếng Việt có dấu
 * @returns Chuỗi tiếng Việt không dấu
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Xây dựng khung HTML template không dấu cho báo cáo PDF 2 trang.
 */
const buildReportHTML = (
  mapImageData: string,
  donutChartImg: string,
  barChartImg: string,
  legendItems: { code: string; desc: string; color: string }[],
  options: ExportReportOptions,
  publishDateTime: string
): string => {
  const title = removeVietnameseTones(options.title || 'BAO CAO GIAM SAT TAI NGUYEN NUOC VA HIEM HOA THUY VAN');
  const author = removeVietnameseTones(options.author || 'Trung tam Du lieu WebAtlas GIS');
  const cleanNotes = removeVietnameseTones(options.notes || '');

  const legendHTML = legendItems.map(item =>
    `<tr>
       <td style="width:20px;"><div style="width:12px;height:12px;background:${item.color};border-radius:2px;border:1px solid #e2e8f0;"></div></td>
       <td style="font-weight:600;color:#1e293b;font-size:9px;padding:3px 6px;">${removeVietnameseTones(item.code)}</td>
       <td style="color:#475569;font-size:9px;padding:3px 6px;">${removeVietnameseTones(item.desc)}</td>
     </tr>`
  ).join('');

  const tableRows = [
    { stt: '1', name: 'Thuy dien Ia Ly', capacity: '720 MW', basin: 'Luu vuc Song Se San', status: 'Binh thuong', statusColor: '#10b981' },
    { stt: '2', name: 'Thuy dien Song Hinh', capacity: '70 MW', basin: 'Luu vuc Song Ba', status: 'Xa lu', statusColor: '#d97706' },
    { stt: '3', name: 'Thuy dien An Khe - Ka Nak', capacity: '160 MW', basin: 'Luu vuc Song Ba', status: 'Binh thuong', statusColor: '#10b981' },
    { stt: '4', name: 'Thuy dien Vinh Son', capacity: '66 MW', basin: 'Luu vuc Song Con', status: 'Binh thuong', statusColor: '#10b981' },
    { stt: '5', name: 'Thuy dien Pleikrong', capacity: '100 MW', basin: 'Luu vuc Song Se San', status: 'Nguy hiem', statusColor: '#ef4444' }
  ];

  const tableHTML = tableRows.map((r, i) =>
    `<tr style="background:${i % 2 === 1 ? '#f8fafc' : '#fff'};">
       <td style="padding:4px 6px;font-size:9px;color:#334155;text-align:center;">${r.stt}</td>
       <td style="padding:4px 6px;font-size:9px;color:#334155;">${r.name}</td>
       <td style="padding:4px 6px;font-size:9px;color:#334155;text-align:center;">${r.capacity}</td>
       <td style="padding:4px 6px;font-size:9px;color:#334155;">${r.basin}</td>
       <td style="padding:4px 6px;font-size:9px;font-weight:700;color:${r.statusColor};text-align:center;">${r.status}</td>
     </tr>`
  ).join('');

  return `
<div id="pdf-report-container" style="width:794px;font-family:Arial,sans-serif;color:#1e293b;background:#fff;">
  
  <!-- ==================== TRANG 1 ==================== -->
  <div style="width:794px;min-height:1123px;box-sizing:border-box;padding:0;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:18px 24px;color:#fff;">
      <div style="font-size:15px;font-weight:700;letter-spacing:0.5px;">${title}</div>
      <div style="font-size:9px;color:#cbd5e1;margin-top:5px;">
        Ngay xuat ban: ${publishDateTime} &nbsp;|&nbsp; Don vi: ${author} &nbsp;|&nbsp; Khu vuc: Duyen hai Nam Trung Bo & Tay Nguyen
      </div>
    </div>

    <div style="padding:16px 24px;">
      <!-- 1. Ảnh chụp bản đồ -->
      <div style="background:#f1f5f9;border-radius:6px;padding:10px;margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#0f172a;margin-bottom:8px;">
          1. ANH CHUP BAN DO HIEN TRANG (MAP SNAPSHOT)
        </div>
        <img src="${mapImageData}" style="width:100%;border:1px solid #e2e8f0;border-radius:4px;" />
      </div>

      <!-- 2. Bảng chú giải ký hiệu -->
      <div style="background:#f8fafc;border-radius:6px;padding:10px;">
        <div style="font-size:11px;font-weight:700;color:#0f172a;margin-bottom:8px;">
          2. GIAI MA CAC KY HIEU BAN DO SU DUNG (MAP SYMBOLS LEGEND)
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${legendHTML}
        </table>
      </div>
    </div>

    <div style="padding:4px 24px;font-size:8px;color:#94a3b8;">
      Trang 1 / 2 — Bao cao duoc xuat tu He thong WebAtlas GIS
    </div>
  </div>

  <!-- ==================== TRANG 2 ==================== -->
  <div style="width:794px;min-height:1123px;box-sizing:border-box;padding:0;page-break-before:always;">
    
    <!-- Header Trang 2 -->
    <div style="background:#0f172a;padding:12px 24px;color:#fff;">
      <div style="font-size:12px;font-weight:700;">BAO CAO THONG KE CHUYEN SAU & BIEU DO AN TOAN THUY DIEN</div>
    </div>

    <div style="padding:16px 24px;">
      <!-- 3. Biểu đồ thống kê -->
      <div style="background:#f1f5f9;border-radius:6px;padding:10px;margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#0f172a;margin-bottom:8px;">
          3. BIEU DO THONG KE TRANG THAI AN TOAN & CONG SUAT (DATA CHARTS)
        </div>
        <div style="display:flex;gap:12px;">
          <img src="${donutChartImg}" style="width:48%;border:1px solid #e2e8f0;border-radius:4px;" />
          <img src="${barChartImg}" style="width:48%;border:1px solid #e2e8f0;border-radius:4px;" />
        </div>
      </div>

      <!-- 4. Bảng tổng hợp -->
      <div style="background:#f8fafc;border-radius:6px;padding:10px;margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#0f172a;margin-bottom:8px;">
          4. BANG TONG HOP TINH TRANG CAC HO CHUA TIEU BIEU
        </div>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">
          <thead>
            <tr style="background:#e2e8f0;">
              <th style="padding:5px 6px;font-size:9px;text-align:center;border:1px solid #cbd5e1;">STT</th>
              <th style="padding:5px 6px;font-size:9px;text-align:left;border:1px solid #cbd5e1;">Ten Cong trinh</th>
              <th style="padding:5px 6px;font-size:9px;text-align:center;border:1px solid #cbd5e1;">Cong suat</th>
              <th style="padding:5px 6px;font-size:9px;text-align:left;border:1px solid #cbd5e1;">Luu vuc Song</th>
              <th style="padding:5px 6px;font-size:9px;text-align:center;border:1px solid #cbd5e1;">Trang thai</th>
            </tr>
          </thead>
          <tbody>
            ${tableHTML}
          </tbody>
        </table>
      </div>

      ${cleanNotes ? `
      <!-- Ghi chú -->
      <div style="background:#fef3c7;border-radius:6px;padding:10px;border-left:3px solid #f59e0b;">
        <div style="font-size:9px;font-weight:700;color:#92400e;">Ghi chu bao cao:</div>
        <div style="font-size:9px;color:#78350f;margin-top:3px;">${cleanNotes}</div>
      </div>
      ` : ''}
    </div>

    <div style="padding:4px 24px;font-size:8px;color:#94a3b8;">
      Trang 2 / 2 — Bao cao duoc xuat tu He thong WebAtlas GIS
    </div>
  </div>
</div>`;
};

/**
 * Hàm thực hiện khởi tạo và tải về Báo cáo PDF giám sát tài nguyên nước & hiểm họa thủy văn.
 * 
 * @param map Thể hiện OpenLayers Map instance
 * @param layersState Danh sách trạng thái hiển thị các lớp bản đồ
 * @param options Các tùy chọn báo cáo (Tiêu đề, Tác giả, Ghi chú)
 */
export const generatePDFReport = async (
  map: Map,
  layersState: LayerState[],
  options: ExportReportOptions = {}
): Promise<void> => {
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  const publishDateTime = `${dateStr} luc ${timeStr}`;

  let mapImageData = '';
  try {
    mapImageData = await getMapSnapshot(map);
  } catch (err) {
    console.warn('Lỗi chụp ảnh bản đồ:', err);
  }

  const statusChartData = [
    { label: 'Binh thuong', value: 12, color: '#10b981' },
    { label: 'Xa lu', value: 4, color: '#f59e0b' },
    { label: 'Nguy hiem', value: 2, color: '#ef4444' }
  ];
  const donutChartImg = createStatusDonutChart(statusChartData, 420, 220);

  const capacityChartData = [
    { name: 'Thuy dien Ia Ly', capacity: 720 },
    { name: 'Thuy dien Song Hinh', capacity: 70 },
    { name: 'Thuy dien An Khe', capacity: 160 },
    { name: 'Thuy dien Vinh Son', capacity: 66 },
    { name: 'Thuy dien Pleikrong', capacity: 100 }
  ];
  const barChartImg = createCapacityBarChart(capacityChartData, 450, 220);

  const activeLayerIds = new Set(layersState.filter(l => l.visible).map(l => l.id));

  const allLegendItems = [
    { layerId: 'layer_dams', code: '[O] Binh thuong', desc: 'Dap & Ho chua Thuy dien dang hoat dong binh thuong', color: '#10b981' },
    { layerId: 'layer_dams', code: '[O] Xa lu', desc: 'Dap & Ho chua Thuy dien dang thuc hien xa lu', color: '#f59e0b' },
    { layerId: 'layer_dams', code: '[O] Nguy hiem', desc: 'Dap & Ho chua Thuy dien o trang thai nguy hiem', color: '#ef4444' },
    { layerId: 'layer_lakes', code: '[###] Ho mat nuoc', desc: 'Mat nuoc ho tu nhien va ho chua', color: '#38bdf8' },
    { layerId: 'layer_rivers', code: '[---] Song ngoi', desc: 'Mang luoi song ngoi va phu luu thuy he', color: '#0ea5e9' },
    { layerId: 'layer_roads', code: '[===] Giao thong', desc: 'Mang luoi giao thong duong bo toan quoc', color: '#f59e0b' },
    { layerId: 'layer_railways', code: '[+-+] Duong sat', desc: 'Tuyen duong sat Viet Nam va cac nhanh', color: '#4b5563' },
    { layerId: 'layer_residential', code: '[*] Dan cu & Do thi', desc: 'Dia diem dan cu, thi tran va do thi', color: '#ef4444' },
    { layerId: 'layer_stations', code: '[*] Tram quan trac', desc: 'Tram do muc nuoc va do luong mua thuy van', color: '#10b981' },
    { layerId: 'layer_flood', code: '[///] Vung ngap lut', desc: 'Khu vuc co nguy co ngap lut do mua lon hoac xa lu', color: '#ef4444' },
    { layerId: 'layer_drought_survey', code: '[*] Khao sat han han', desc: 'Diem khao sat han han va suy giam nuoc ngam', color: '#b45309' },
    { layerId: 'layer_saltwater_intrusion', code: '[*] Xam nhap man', desc: 'Diem do va khao sat do man cua nuoc', color: '#7c3aed' },
    { layerId: 'layer_flood_generation', code: '[///] Vung sinh lu', desc: 'Luu vuc song thuong nguon sinh lu quet', color: '#4f46e5' },
    { layerId: 'layer_provinces_2026', code: '[...] Ranh gioi Tinh', desc: 'Ranh gioi hanh chinh cap Tinh/Thanh pho', color: '#4b5563' }
  ];

  const legendItems = allLegendItems.filter(item => activeLayerIds.size === 0 || activeLayerIds.has(item.layerId));

  const htmlContent = buildReportHTML(mapImageData, donutChartImg, barChartImg, legendItems, options, publishDateTime);

  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  const reportElement = container.querySelector('#pdf-report-container') as HTMLElement;

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    await doc.html(reportElement, {
      callback: (doc) => {
        const filename = `BaoCao_WebAtlas_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours()}${now.getMinutes()}.pdf`;
        doc.save(filename);
      },
      x: 0,
      y: 0,
      width: 595.28,
      windowWidth: 794,
      autoPaging: 'text'
    });
  } finally {
    document.body.removeChild(container);
  }
};
