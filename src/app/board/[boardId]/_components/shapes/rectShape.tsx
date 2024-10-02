import React from "react";
import { Rect } from "react-konva";
import { Node } from "../../_contexts/boardContext";
import Konva from "konva";
type RectShapeProps = {
  node: Node;
};

const RectShape = ({ node }: RectShapeProps) => {
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
    <Rect
      width={node.width}
      height={node.height}
      fill={node.fillColor}
      stroke={node.strokeColor}
      strokeWidth={node.strokeWidth}
      cornerRadius={0}
      strokeScaleEnabled={false}
      onTransform={handleTransform}
    />
  );
};

export default RectShape;
