/**
 * @file useExportController.ts
 * @directory src/controllers
 * @description Controller điều khiển quy trình xuất báo cáo giám sát tài nguyên nước & đập thủy điện ra file PDF.
 * 
 * Chức năng chính: Controller Xuất Báo cáo PDF (PDF Export Process Controller)
 * Các chức năng nhỏ:
 * - Quản lý trạng thái mở/đóng Modal cấu hình xuất báo cáo.
 * - Quản lý trạng thái đang xuất (isExporting) để hiển thị spinner trên nút View.
 * - Gọi Model `pdfReportBuilderModel` để thực thi quy trình chụp ảnh bản đồ, sinh biểu đồ và đóng gói PDF.
 */

import { useState } from 'react';
import { useMapController } from './useMapController';
import { generatePDFReport } from '../models/pdfReportBuilderModel';
import type { ExportReportOptions } from '../models/mapTypes';

export const useExportController = () => {
  const { map, layersState } = useMapController();
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * Bắt đầu quy trình xuất file PDF với các tùy chọn do người dùng nhập từ View.
   * 
   * @param options Tiêu đề, tác giả, ghi chú báo cáo
   */
  const handleExportPDF = async (options: ExportReportOptions = {}) => {
    if (!map) {
      alert('Bản đồ chưa sẵn sàng!');
      return;
    }

    try {
      setIsExporting(true);
      await generatePDFReport(map, layersState, options);
      setShowModal(false);
    } catch (error) {
      console.error('Lỗi trong quá trình xuất PDF:', error);
      alert('Đã xảy ra lỗi khi tạo file PDF. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    showModal,
    setShowModal,
    handleExportPDF
  };
};
