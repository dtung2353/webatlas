import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Map } from 'ol';
import { layerGroups } from '../data/mockData';

export type BasemapType = 'satellite' | 'street' | 'dem';
export type ReservoirFilterType = 'all' | 'binh_thuong' | 'xa_lu' | 'nguy_hiem';

export interface LayerState {
  id: string;
  visible: boolean;
  opacity: number;
}

export interface PopupData {
  coordinate: number[];
  feature: any; // GeoJSON properties
}

interface MapContextType {
  map: Map | null;
  setMap: (map: Map | null) => void;
  basemap: BasemapType;
  setBasemap: (basemap: BasemapType) => void;
  layersState: LayerState[];
  toggleLayerVisibility: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  reservoirFilter: ReservoirFilterType;
  setReservoirFilter: (filter: ReservoirFilterType) => void;
  popupData: PopupData | null;
  setPopupData: (data: PopupData | null) => void;
  highlightedRiverBasin: string | null;
  setHighlightedRiverBasin: (basin: string | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<Map | null>(null);
  const [basemap, setBasemap] = useState<BasemapType>('street');
  const [reservoirFilter, setReservoirFilter] = useState<ReservoirFilterType>('all');
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [highlightedRiverBasin, setHighlightedRiverBasin] = useState<string | null>(null);
  
  // Initialize layers state from mockData
  const initialLayersState: LayerState[] = [];
  layerGroups.forEach(group => {
    group.layers.forEach(layer => {
      initialLayersState.push({
        id: layer.id,
        visible: layer.defaultVisible,
        opacity: layer.opacity
      });
    });
  });

  const [layersState, setLayersState] = useState<LayerState[]>(initialLayersState);

  const toggleLayerVisibility = (layerId: string) => {
    setLayersState(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const setLayerOpacity = (layerId: string, opacity: number) => {
    setLayersState(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  return (
    <MapContext.Provider value={{
      map, setMap,
      basemap, setBasemap,
      layersState, toggleLayerVisibility, setLayerOpacity,
      reservoirFilter, setReservoirFilter,
      popupData, setPopupData,
      highlightedRiverBasin, setHighlightedRiverBasin
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
