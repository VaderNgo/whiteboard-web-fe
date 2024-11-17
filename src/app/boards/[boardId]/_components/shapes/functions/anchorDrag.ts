import Konva from "konva";
import { BoardContext, Node, Path, PathPoint } from "../../../_contexts/boardContext";

export function dragAnchorBounds(
  ref: React.RefObject<Konva.Circle | null>,
  node: Node,
  index: number
) {
  return;
}

export function handleAnchorDragStart(
  e: Konva.KonvaEventObject<DragEvent>,
  nodeId: string,
  index: number,
  setDrawingPath: (path: Path | null) => void,
  setIsDrawingPath: (isDrawing: boolean) => void,
  nodes: Map<string, Node>
) {
  const node = nodes.get(nodeId);
  if (!node) return;
  const currentAnchor = node.anchorPoints[index];
  const initialPoint = new PathPoint().setAttrs({
    command: "M",
    x: currentAnchor.position.x,
    y: currentAnchor.position.y,
  });
  setDrawingPath(
    new Path().setAttrs({
      points: [initialPoint],
    })
  );
  setIsDrawingPath(true);
}

export function handleAnchorDragMove(
  e: Konva.KonvaEventObject<DragEvent>,
  nodeId: string,
  index: number,
  stageRef: React.RefObject<Konva.Stage>,
  drawingPath: Path | null,
  setDrawingPath: (path: Path | null) => void,
  isDrawingPath: boolean
) {
  if (!isDrawingPath || !drawingPath) return;
  const pos = stageRef?.current?.getRelativePointerPosition();
  if (!pos) return;
  const start = drawingPath.points[0];
  const end = { x: pos.x, y: pos.y };
  const newPoints = [
    new PathPoint().setAttrs({ command: "M", x: start.x, y: start.y }),
    new PathPoint().setAttrs({ command: "L", x: end.x, y: start.y }),
    new PathPoint().setAttrs({ command: "L", x: end.x, y: end.y }),
  ];
  if (!pos) return;
  setDrawingPath(
    new Path().setAttrs({
      ...drawingPath,
      points: newPoints,
    })
  );
}

export function handleAnchorDragEnd(
  e: Konva.KonvaEventObject<DragEvent>,
  nodeId: string,
  index: number
) { }
