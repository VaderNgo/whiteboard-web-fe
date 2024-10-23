import { useContext } from "react";
import { BoardAction, BoardContext, Path } from "../../_contexts/boardContext";
import { ControlPoint } from "./controlPoint";
import {
  clearActiveDrag,
  getControlPointCoords,
  setActiveDrag,
  updatePath,
  updatePathFromExtrude,
  updatePathFromTip,
} from "./functions";
import { handlePathEndpointDrag } from "./functions/snapping";

interface ControlPointsProps {
  path: Path;
  onChange: (path: Path) => void;
}

export function ControlPoints({ path, onChange }: ControlPointsProps) {
  const { boardAction, setBoardAction, stageRef, nodes, selectedPath, setSelectedPath } =
    useContext(BoardContext);
  const sourcePoint = path.points[0];
  const destinationPoint = path.points[path.points.length - 1];
  const source = (
    <ControlPoint
      x={sourcePoint.x}
      y={sourcePoint.y}
      type="tip"
      isDraggable={path.startAnchorPoint == null}
      onDragMove={(e) => {
        const pos = stageRef?.current?.getRelativePointerPosition();
        if (!pos) return;
        onChange(handlePathEndpointDrag(path, 0, pos, nodes, e));
      }}
      onDragStart={() => {
        setBoardAction(BoardAction.DragPath);
        setSelectedPath(path);
      }}
      onDragEnd={() => {
        setBoardAction(BoardAction.Select);
      }}
      path={path}
    />
  );
  const destination = (
    <ControlPoint
      x={destinationPoint.x}
      y={destinationPoint.y}
      type="tip"
      isDraggable={path.endAnchorPoint == null}
      onDragMove={(e) => {
        const pos = stageRef?.current?.getRelativePointerPosition();
        if (!pos) return;
        onChange(handlePathEndpointDrag(path, path.points.length - 1, pos, nodes, e));
      }}
      onDragStart={() => {
        setBoardAction(BoardAction.DragPath);
        setSelectedPath(path);
      }}
      onDragEnd={() => {
        setBoardAction(BoardAction.Select);
      }}
      path={path}
    />
  );
  const controls = path.edges.map((edge, index) => {
    const { x, y } = getControlPointCoords(path.points, edge);
    const key = `control-point-${index}`;
    return (
      <ControlPoint
        key={key}
        x={x}
        y={y}
        isDraggable={true}
        axis={edge.axis as "x" | "y"}
        onDragMove={(e) => {
          onChange(updatePath(path, edge, e.target.getPosition()));
        }}
      />
    );
  });
  const extrudables = path.extrudableEdges.map((edge, index) => {
    const { x, y } = getControlPointCoords(path.points, edge);
    const key = `extrudable-point-${index}`;
    return (
      <ControlPoint
        key={key}
        x={x}
        y={y}
        isDraggable={true}
        axis={edge.axis as "x" | "y"}
        onDragStart={() => {
          onChange(setActiveDrag(path));
        }}
        onDragMove={(e) => {
          onChange(updatePathFromExtrude(path, edge, e.target.getPosition()));
        }}
        onDragEnd={() => {
          onChange(clearActiveDrag(path));
        }}
      />
    );
  });
  return (
    <>
      {source}
      {selectedPath && selectedPath.id === path.id && controls}
      {selectedPath && selectedPath.id === path.id && extrudables}
      {destination}
    </>
  );
}
