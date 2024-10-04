import React, { useEffect } from "react";
import { Circle, Ellipse } from "react-konva";
import { Node } from "../../_contexts/boardContext";
import Konva from "konva";

type EllipseShapeProps = {
  node: Node;
  isHovering: boolean;
};

const EllipseShape = ({ node, isHovering }: EllipseShapeProps) => {
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

  let anchorPoints = (node: Node) => {
    return [
      [0, node.height / 2],
      [node.width / 2, 0],
      [-node.width / 2, 0],
      [0, -node.height / 2],
    ];
  };
  return (
    <>
      {isHovering &&
        anchorPoints(node).map((point, index) => (
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
