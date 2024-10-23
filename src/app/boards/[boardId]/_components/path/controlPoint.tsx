import { Vector2d } from "konva/lib/types";
import React, { useContext, useRef } from "react";
import { Circle } from "react-konva";
import { findNearestAnchorPoint } from "./functions/snapping";
import { BoardContext, History, Path } from "../../_contexts/boardContext";
import Konva from "konva";

const STROKE_WIDTH = 4;
const RADIUS = 8;
const HOVER_STROKE_WIDTH = 6;
const HOVER_RADIUS = 10;

interface ControlPointProps {
  x: number;
  y: number;
  axis?: "x" | "y";
  isDraggable: boolean;
  onDragStart?: (e: any) => void;
  onDragMove?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  type?: "control" | "tip";
  index?: number;
  path?: Path;
}

export function ControlPoint({
  x,
  y,
  axis,
  onDragStart,
  onDragMove,
  onDragEnd,
  isDraggable = true,
  type = "control",
  index = -1,
  path,
}: ControlPointProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { selectedPath, setSelectedPath, setUndoStack, paths } = useContext(BoardContext);
  const anchorRef = useRef<Konva.Circle | null>(null);

  const handleOnDragStart = (e: any) => {
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const dragBoundFunc = (
    pos: { x: number; y: number },
    axis: "x" | "y",
    anchorRef: any,
    type: any
  ) => {
    if (type !== "tip" && anchorRef.current !== null) {
      const staticPos = anchorRef.current.getAbsolutePosition();
      const otherAxis = axis === "y" ? "x" : "y";
      return {
        [axis]: pos[axis],
        [otherAxis]: staticPos[otherAxis],
      };
    }
    return pos;
  };
  return (
    <Circle
      ref={anchorRef}
      x={x}
      y={y}
      radius={isHovered ? HOVER_RADIUS : RADIUS}
      fill="white"
      stroke="#b00b69"
      strokeWidth={isHovered ? HOVER_STROKE_WIDTH : STROKE_WIDTH}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={isDraggable}
      onDragStart={handleOnDragStart}
      onDragMove={onDragMove}
      onDragEnd={(e) => {
        if (onDragEnd) {
          onDragEnd(e);
        }
      }}
      onClick={() => {
        if (type === "tip") {
          setSelectedPath(path!);
        }
      }}
      dragBoundFunc={(pos) => dragBoundFunc(pos, axis as "x" | "y", anchorRef, type) as Vector2d}
      perfectDrawEnabled={false}
    />
  );
}
