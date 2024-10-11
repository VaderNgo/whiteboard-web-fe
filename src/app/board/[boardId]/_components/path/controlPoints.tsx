import React from "react";
import {
  calculateEdges,
  clearActiveDrag,
  getControlPointCoords,
  setActiveDrag,
  updatePath,
  updatePathFromExtrude,
  updatePathFromTip,
} from "./functions";
import { Path, PathEdge } from "../../_contexts/boardContext";
import { ControlPoint } from "./controlPoint";

interface ControlPointsProps {
  path: Path;
  onChange: (path: Path) => void;
}

export function ControlPoints({ path, onChange }: ControlPointsProps) {
  const sourcePoint = path.points[0];
  const destinationPoint = path.points[path.points.length - 1];
  const source = (
    <ControlPoint
      x={sourcePoint.x}
      y={sourcePoint.y}
      type="tip"
      isDraggable={path.startAnchorPoint == null}
      onDragMove={(e) => {
        if (path.startAnchorPoint == null) {
          onChange(updatePathFromTip(path, 0, e.target.getPosition()));
        }
      }}
    />
  );
  const destination = (
    <ControlPoint
      x={destinationPoint.x}
      y={destinationPoint.y}
      type="tip"
      isDraggable={path.endAnchorPoint == null}
      onDragMove={(e) => {
        if (path.endAnchorPoint == null) {
          onChange(updatePathFromTip(path, path.points.length - 1, e.target.getPosition()));
        }
      }}
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
      {controls}
      {extrudables}
      {destination}
    </>
  );
}
