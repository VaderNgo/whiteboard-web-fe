import React, { useEffect } from "react";
import { Circle, Rect } from "react-konva";
import { Node } from "../../_contexts/boardContext";
import Konva from "konva";
type RectShapeProps = {
  node: Node;
  isHovering: boolean;
};

const RectShape = ({ node, isHovering }: RectShapeProps) => {
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
      {isHovering &&
        node.anchorPoints.map((point, index) => (
          <Circle
            key={index}
            x={point[0]}
            y={point[1]}
            radius={10}
            fill="white"
            stroke="#b00b69"
            strokeWidth={3}
            strokeScaleEnabled={false}
            onMouseEnter={(e) => e.target.to({ strokeWidth: 5, radius: 15, duration: 0.2 })}
            onMouseLeave={(e) => e.target.to({ strokeWidth: 3, radius: 10, duration: 0.2 })}
          />
        ))}
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
    </>
  );
};

export default RectShape;
