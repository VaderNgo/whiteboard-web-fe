import { Circle, RegularPolygon } from "react-konva";
import { BoardAction, BoardContext, Node } from "../../_contexts/boardContext";
import { useContext, useEffect } from "react";

type PolygonShapeProps = {
  node: Node;
  isHovering: boolean;
};

const PolygonShape = ({ node, isHovering }: PolygonShapeProps) => {
  const { boardAction } = useContext(BoardContext);
  useEffect(() => {}, [isHovering]);

  const radius = Math.min(node.width, node.height) / 2;
  const scaleX = node.width / radius;
  const scaleY = node.height / radius;

  return (
    <>
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
