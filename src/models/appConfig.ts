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

export { MAPSERVER_URL, buildMapServerUrl } from '../shared/config/mapServer';
