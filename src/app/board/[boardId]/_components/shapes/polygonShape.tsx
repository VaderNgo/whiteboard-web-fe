import { Circle, RegularPolygon } from "react-konva";
import { Node } from "../../_contexts/boardContext";
import { useEffect } from "react";

type PolygonShapeProps = {
  node: Node;
  isHovering: boolean;
};

const PolygonShape = ({ node, isHovering }: PolygonShapeProps) => {
  useEffect(() => {}, [isHovering]);

  const radius = Math.min(node.width, node.height) / 2;
  const scaleX = node.width / radius;
  const scaleY = node.height / radius;

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
      <RegularPolygon
        radius={radius}
        sides={node.sides}
        fill={node.fillColor}
        stroke={node.strokeColor}
        strokeWidth={node.strokeWidth}
        strokeScaleEnabled={false}
        scaleX={scaleX}
        scaleY={scaleY}
      />
    </>
  );
};

export default PolygonShape;
