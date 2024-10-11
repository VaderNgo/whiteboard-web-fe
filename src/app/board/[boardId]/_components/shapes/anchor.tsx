import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Circle } from "react-konva";
import { BoardAction } from "../../_contexts/boardContext";

type AnchorProps = {
  nodeId: string;
  index: number;
  isHovering: boolean;
  x: number;
  y: number;
  boardAction: BoardAction;
};

export const Anchor = ({ nodeId, index, isHovering, x, y, boardAction }: AnchorProps) => {
  const anchorRef = useRef<Konva.Circle | null>(null);
  useEffect(() => {}, []);

  return (
    <Circle
      ref={anchorRef}
      key={index}
      zIndex={0}
      x={x}
      y={y}
      radius={10}
      fill="white"
      stroke="#b00b69"
      visible={
        isHovering || boardAction === BoardAction.DrawLine || boardAction === BoardAction.DragPath
      }
      strokeWidth={3}
      strokeScaleEnabled={false}
      onMouseEnter={(e) => {
        e.target.to({ strokeWidth: 5, radius: 15, duration: 0.2 });
      }}
      onMouseLeave={(e) => e.target.to({ strokeWidth: 3, radius: 10, duration: 0.2 })}
    />
  );
};
