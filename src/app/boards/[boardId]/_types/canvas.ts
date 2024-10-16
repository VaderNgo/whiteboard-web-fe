import { Point, LayerType, XYWH, Side } from "./layer";
export type CanvasState =
    | {
          mode: CanvasMode.None;
      }
    | {
          mode: CanvasMode.SelectionNet;
          origin: Point;
          current?: Point;
      }
    | {
          mode: CanvasMode.Translating;
          current: Point;
      }
    | {
          mode: CanvasMode.Inserting;
          layerType: LayerType.Ellipse | LayerType.Line | LayerType.Text | LayerType.Note | LayerType.Rectangle;
      }
    | {
          mode: CanvasMode.Resizing;
          initialBound: XYWH;
          corner: Side;
      }
    | {
          mode: CanvasMode.Pencil;
      }
    | {
          mode: CanvasMode.Pressing;
          origin: Point;
      };
export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}
