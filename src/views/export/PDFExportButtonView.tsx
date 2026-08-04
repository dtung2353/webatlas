/**
 * @file PDFExportButtonView.tsx
 * @directory src/views/export
 * @description View hiển thị nút bấm và modal tùy chỉnh thông tin xuất báo cáo PDF (PDF Export Button View Component).
 * 
 * Chức năng chính: View Nút bấm & Modal Xuất Báo cáo PDF (PDF Export UI Control View)
 * Các chức năng nhỏ:
 * - Nút bấm nổi Glassmorphism đồng bộ với các công cụ bản đồ khác.
 * - Modal tùy chỉnh Tiêu đề báo cáo, Đơn vị phát hành và Ghi chú thêm.
 * - Gọi Controller `useExportController` để khởi chạy tiến trình xuất file PDF.
 */

import React, { useState } from 'react';
import { useExportController } from '../../controllers/useExportController';
import { FileText, Download, X, Loader2, CheckCircle } from 'lucide-react';

const PDFExportButtonView: React.FC = () => {
  const { isExporting, showModal, setShowModal, handleExportPDF } = useExportController();
  const [success, setSuccess] = useState(false);
  const [reportTitle, setReportTitle] = useState('BAO CAO GIAM SAT TAI NGUYEN NUOC & HIEM HOA THUY VAN');
  const [author, setAuthor] = useState('Trung tam Du lieu WebAtlas GIS');
  const [notes, setNotes] = useState('Bao cao tong hop tu dong tu he thong giam sat thoi gian thuc.');

  const onExportSubmit = async () => {
    setSuccess(false);
    await handleExportPDF({
      title: reportTitle,
      author: author,
      notes: notes
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1500);
  };

  return (
    <>
      <button 
        className="export-pdf-trigger-btn glass-panel"
        onClick={() => setShowModal(true)}
        title="Xuất Báo cáo PDF Bản đồ & Thống kê"
      >
        <FileText size={18} />
      </button>

      {showModal && (
        <div className="ogc-modal-overlay" onClick={() => !isExporting && setShowModal(false)}>
          <div className="ogc-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ogc-modal-header">
              <h3 className="font-semibold flex items-center gap-2 text-blue-500">
                <FileText size={18} />
                Cấu hình Xuất Báo cáo PDF
              </h3>
              <button onClick={() => !isExporting && setShowModal(false)} className="close-btn"><X size={18} /></button>
            </div>
            
            <div className="ogc-modal-content">
              <div className="input-group">
                <label>Tiêu đề Báo cáo (Không dấu)</label>
                <input 
                  type="text" 
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Nhap tieu de bao cao..."
                  disabled={isExporting}
                />
              </div>

              <div className="input-group">
                <label>Đơn vị phát hành (Không dấu)</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ten don vi phat hanh..."
                  disabled={isExporting}
                />
              </div>

              <div className="input-group">
                <label>Ghi chú thêm (Không dấu)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhap ghi chu cho bao cao..."
                  rows={2}
                  disabled={isExporting}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.5)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="diagrammatic-info" style={{ marginBottom: '16px' }}>
                <div className="title">Nội dung tệp PDF báo cáo:</div>
                <ul>
                  <li><strong>Bản đồ:</strong> Ảnh chụp hiện trạng thời gian thực</li>
                  <li><strong>Chú giải:</strong> Ký hiệu các lớp dữ liệu đang bật</li>
                  <li><strong>Thống kê:</strong> Biểu đồ trạng thái & công suất đập</li>
                </ul>
              </div>

              <button 
                className="add-layer-btn" 
                onClick={onExportSubmit}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang tạo tệp PDF...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Đã tải PDF về máy!</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Tạo & Tải Báo cáo PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFExportButtonView;
