import { useState } from 'react';
import { MapProvider } from '../controllers/MapController';
import MapView from '../features/map/MapView';
import BasemapSwitcherView from '../features/layers/BasemapSwitcherView';
import LayerTreeView from '../features/layers/LayerTreeView';
import MapControlsView from '../views/map/MapControlsView';
import SearchBarView from '../features/search/SearchBarView';
import DynamicPopupView from '../features/popup/DynamicPopupView';
import DynamicLegendView from '../views/popup/DynamicLegendView';
import OGCClientView from '../features/ogc/OGCClientView';
import PDFExportButtonView from '../features/export/PDFExportButtonView';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import '../styles/main.css';

function App() {
  const [panelsVisible, setPanelsVisible] = useState(true);

  return (
    <MapProvider>
      <div className="app-container">
        <MapView />
        <MapControlsView />
        <div className={`panels-wrapper ${panelsVisible ? '' : 'hidden'}`}>
          <LayerTreeView />
          <BasemapSwitcherView />
          <SearchBarView />
          <DynamicLegendView />
          <OGCClientView />
          <PDFExportButtonView />
        </div>
        <DynamicPopupView />
        <button
          className="toggle-panels-btn glass-panel"
          onClick={() => setPanelsVisible(!panelsVisible)}
          title={panelsVisible ? 'Ẩn các panel' : 'Hiện các panel'}
        >
          {panelsVisible ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          <span>{panelsVisible ? 'Ẩn giao diện' : 'Hiện giao diện'}</span>
        </button>
      </div>
    </MapProvider>
  );
}

export default App;
