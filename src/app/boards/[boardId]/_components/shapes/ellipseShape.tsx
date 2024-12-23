import React, { useContext, useEffect } from "react";
import { Circle, Ellipse } from "react-konva";
import { BoardAction, BoardContext, Node } from "../../_contexts/boardContext";
import Konva from "konva";

type EllipseShapeProps = {
  node: Node;
  isHovering: boolean;
};

const EllipseShape = ({ node, isHovering }: EllipseShapeProps) => {
  const { boardAction } = useContext(BoardContext);
  useEffect(() => {}, [isHovering]);

  const handleTransform = (e: Konva.KonvaEventObject<Event>) => {
    const scaleX = e.target.scaleX();
    const scaleY = e.target.scaleY();
    const attrs = {
      x: e.target.x(),
      y: e.target.y(),
      width: e.target.width() * scaleX,
      height: e.target.height() * scaleY,
    };
    e.target.setAttrs(attrs);
    e.target.scale({ x: 1, y: 1 });
  };

  return (
    <>
      <Ellipse
        fill={node.fillColor}
        stroke={node.strokeColor}
        strokeWidth={node.strokeWidth}
        radiusX={node.width / 2}
        radiusY={node.height / 2}
        strokeScaleEnabled={false}
        onTransform={handleTransform}
      />
    </>
  );
};

export default EllipseShape;
