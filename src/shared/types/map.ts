export type BasemapType = 'satellite' | 'street' | 'dem';

export type ReservoirFilterType = 'all' | 'binh_thuong' | 'xa_lu' | 'nguy_hiem';

export interface LayerState {
  id: string;
  visible: boolean;
  opacity: number;
}

export interface PopupData {
  coordinate: number[];
  feature: any;
}

export interface DamDetails {
  ten: string;
  loai: string;
  vatLieu: string;
  capCongTrinh: string;
  caoTrinhDinh: string;
  caoTrinhTuongChan: string;
  chieuDai: string;
  chieuCaoMax: string;
  chieuRongDinh: string;
  maiThuongLuu: string;
  thamNang: string;
  thamNhe: string;
}

export interface RelatedRivers {
  basin: string;
  mainRiver: string | null;
  branches: string[];
}

export interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

export interface ExportReportOptions {
  title?: string;
  author?: string;
  notes?: string;
}
