export class LayerStateModel {
  public id: string;
  public visible: boolean;
  public opacity: number;

  constructor(id: string, visible: boolean, opacity: number) {
    this.id = id;
    this.visible = visible;
    this.opacity = opacity;
  }

  toggleVisibility(): LayerStateModel {
    return new LayerStateModel(this.id, !this.visible, this.opacity);
  }

  setOpacity(opacity: number): LayerStateModel {
    return new LayerStateModel(this.id, this.visible, opacity);
  }

  clone(): LayerStateModel {
    return new LayerStateModel(this.id, this.visible, this.opacity);
  }
}
