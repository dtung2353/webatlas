/**
 * @file chartGeneratorModel.ts
 * @directory src/models
 * @description Model sinh biểu đồ đồ họa thống kê sử dụng HTML5 Canvas (Canvas Chart Generator Model).
 * 
 * Chức năng chính: Model Tạo Biểu đồ Thống kê Đồ họa (HTML5 Canvas Chart Builder Model)
 * Các chức năng nhỏ:
 * - createStatusDonutChart: Tạo biểu đồ hình vành khăn (Donut Chart) thống kê tỷ lệ trạng thái an toàn đập thủy điện.
 * - createCapacityBarChart: Tạo biểu đồ cột ngang (Bar Chart) thống kê công suất của các công trình thủy điện tiêu biểu.
 * - Đảm bảo chuỗi nhãn chuẩn mã hóa để nhúng trực tiếp vào file PDF.
 */

import type { ChartDataItem } from './mapTypes';

/**
 * Tạo biểu đồ tròn dạng Donut (Donut Chart) thống kê phân bố trạng thái đập thủy điện.
 * 
 * @param data Mảng dữ liệu thống kê trạng thái (Nhãn, Giá trị, Màu sắc)
 * @param width Chiều rộng canvas (px)
 * @param height Chiều cao canvas (px)
 * @returns Chuỗi hình ảnh Base64 PNG
 */
export const createStatusDonutChart = (
  data: ChartDataItem[], 
  width = 400, 
  height = 240
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Nền trắng
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const total = data.reduce((acc, item) => acc + item.value, 0);
  if (total === 0) return canvas.toDataURL('image/png');

  const centerX = 110;
  const centerY = height / 2;
  const outerRadius = 80;
  const innerRadius = 45;

  let startAngle = -Math.PI / 2;

  // Vẽ các hình quạt Donut
  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    ctx.fillStyle = item.color;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle = endAngle;
  });

  // Chữ tổng số ở giữa
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${total}`, centerX, centerY - 6);
  ctx.font = '10px Arial, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Cong trinh', centerX, centerY + 10);

  // Vẽ Chú giải Legend bên phải
  const legendX = 220;
  let legendY = 50;

  ctx.textAlign = 'left';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('Phan bo Trang thai Dap:', legendX, legendY);
  legendY += 25;

  data.forEach((item) => {
    const percent = Math.round((item.value / total) * 100);

    // Ô màu
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY - 10, 14, 14);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY - 10, 14, 14);

    // Nhãn & Giá trị
    ctx.fillStyle = '#334155';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText(`${item.label}: `, legendX + 22, legendY);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.fillText(`${item.value} (${percent}%)`, legendX + 115, legendY);

    legendY += 28;
  });

  return canvas.toDataURL('image/png');
};

/**
 * Tạo biểu đồ cột ngang (Bar Chart) thống kê công suất các đập thủy điện tiêu biểu.
 * 
 * @param data Danh sách tên công trình và công suất (MW)
 * @param width Chiều rộng canvas (px)
 * @param height Chiều cao canvas (px)
 * @returns Chuỗi hình ảnh Base64 PNG
 */
export const createCapacityBarChart = (
  data: { name: string; capacity: number }[], 
  width = 440, 
  height = 240
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Nền trắng
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillText('Cong suat Thuy dien Tieu bieu (MW):', 15, 25);

  const maxCap = Math.max(...data.map(d => d.capacity), 100);
  const chartLeft = 110;
  const chartTop = 45;
  const chartWidth = 300;
  const rowHeight = 32;

  data.forEach((item, index) => {
    const y = chartTop + index * rowHeight;
    const barWidth = (item.capacity / maxCap) * chartWidth;

    // Tên công trình
    ctx.fillStyle = '#334155';
    ctx.font = '11px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(item.name, chartLeft - 10, y + 14);

    // Cột
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(chartLeft, y + 2, barWidth, 18);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(chartLeft, y + 2, barWidth, 18);

    // Con số MW
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.capacity} MW`, chartLeft + barWidth + 8, y + 15);
  });

  return canvas.toDataURL('image/png');
};
