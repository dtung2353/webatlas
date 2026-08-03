/**
 * @file appConfig.ts
 * @directory src/models
 * @description Model quản lý cấu hình hệ thống, tham số môi trường và đường dẫn kết nối MapServer OGC.
 * 
 * Chức năng chính: Model Cấu hình Hệ thống & Đường dẫn Dịch vụ (System Configuration Model)
 * Các chức năng nhỏ:
 * - MAPSERVER_URL: Đường dẫn URL chính tới dịch vụ CGI MapServer (Local dev hoặc Reverse proxy Nginx).
 * - buildMapServerUrl: Hàm tiện ích sinh đường dẫn URL đầy đủ kèm tham số truy vấn (Query parameters).
 */

const isDev = import.meta.env.DEV;

/** Đường dẫn URL gốc kết nối tới dịch vụ MapServer CGI */
export const MAPSERVER_URL = 
  import.meta.env.VITE_MAPSERVER_URL || 
  (isDev ? 'http://localhost:8081/?' : '/mapserver/?');

/**
 * Hàm sinh đường dẫn URL đầy đủ của MapServer kèm theo các tham số truy vấn WMS/WFS/OGC.
 * 
 * @param queryParams Chuỗi tham số truy vấn OGC (Ví dụ: "SERVICE=WMS&REQUEST=GetCapabilities")
 * @returns Đường dẫn URL hoàn chỉnh để gửi request
 */
export function buildMapServerUrl(queryParams: string): string {
  const base = MAPSERVER_URL;
  const cleanParams = queryParams.replace(/^[?&]/, '');
  if (base.endsWith('?') || base.endsWith('&')) {
    return `${base}${cleanParams}`;
  }
  return base.includes('?') ? `${base}&${cleanParams}` : `${base}?${cleanParams}`;
}
