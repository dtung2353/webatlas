/**
 * @file mapServer.ts
 * @directory src/shared/config
 * @description Model cấu hình kết nối đường dẫn URL tới dịch vụ OGC WMS/WFS MapServer tương thích môi trường Docker & Nginx.
 * 
 * Kiến trúc MVC: Model (Service Endpoint & Reverse Proxy Model)
 * Các đặc tính chính:
 * - Môi trường Dev (Development): Kết nối tới MapServer qua cổng `http://localhost:8081/?`.
 * - Môi trường Docker / Prod (Production): Kết nối qua Nginx Reverse Proxy `/mapserver/?` định tuyến ngầm tới container `mapserver:80`.
 * - buildMapServerUrl: Hàm helper xây dựng query String đầy đủ không bị đúp ký tự `?` hoặc `&`.
 */

const isDev = import.meta.env.DEV;

export const MAPSERVER_URL =
  import.meta.env.VITE_MAPSERVER_URL ||
  (isDev ? 'http://localhost:8081/?' : '/mapserver/?');

export function buildMapServerUrl(queryParams: string): string {
  const base = MAPSERVER_URL;
  const cleanParams = queryParams.replace(/^[?&]/, '');
  if (base.endsWith('?') || base.endsWith('&')) {
    return `${base}${cleanParams}`;
  }
  return base.includes('?') ? `${base}&${cleanParams}` : `${base}?${cleanParams}`;
}
