/**
 * @file PDFExportButtonView.tsx
 * @directory src/views/export
 * @description View hiển thị nút bấm và modal tùy chỉnh thông tin xuất báo cáo PDF (PDF Export Button View Component).
 * 
 * Chức năng chính: View Nút bấm & Modal Xuất Báo cáo PDF (PDF Export UI Control View)
 * Các chức năng nhỏ:
 * - Nút bấm kích hoạt Modal cấu hình báo cáo.
 * - Nhập Tiêu đề báo cáo, Đơn vị phát hành và Ghi chú thêm.
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
        className="ogc-trigger-btn glass-panel text-blue-600"
        onClick={() => setShowModal(true)}
        title="Xuất Báo cáo PDF Bản đồ & Thống kê"
        style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', cursor: 'pointer', background: 'var(--panel-bg, rgba(255, 255, 255, 0.85))', backdropFilter: 'blur(8px)' }}
      >
        <FileText size={18} className="text-blue-500" />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main, #1e293b)' }}>Xuất PDF</span>
      </button>

      {showModal && (
        <div className="ogc-modal-overlay" onClick={() => !isExporting && setShowModal(false)}>
          <div className="ogc-modal glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="ogc-modal-header">
              <h3 className="font-semibold flex items-center gap-2 text-blue-600">
                <FileText size={18} />
                Cấu hình Xuất Báo cáo PDF
              </h3>
              <button onClick={() => !isExporting && setShowModal(false)} className="close-btn"><X size={18} /></button>
            </div>
            
            <div className="ogc-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="input-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Tiêu đề Báo cáo (Không dấu)</label>
                <input 
                  type="text" 
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Nhap tieu de bao cao..."
                  disabled={isExporting}
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Đơn vị phát hành (Không dấu)</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ten don vi phat hanh..."
                  disabled={isExporting}
                />
              </div>

              <div className="input-group">
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Ghi chú thêm (Không dấu)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhap ghi chu cho bao cao..."
                  rows={2}
                  disabled={isExporting}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <button 
                className="add-layer-btn" 
                onClick={onExportSubmit}
                disabled={isExporting}
                style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#2563eb', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: 600 }}
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
