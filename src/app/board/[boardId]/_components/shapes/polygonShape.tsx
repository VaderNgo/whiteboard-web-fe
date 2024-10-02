import React, { useEffect, useRef, useState } from "react";
import { RegularPolygon } from "react-konva";
import { Node } from "../../_contexts/boardContext";
import Konva from "konva";

type PolygonShapeProps = {
  node: Node;
};

const PolygonShape = ({ node }: PolygonShapeProps) => {
  const polygonRef = useRef<Konva.RegularPolygon>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (polygonRef.current) {
      const shape = polygonRef.current;
      setOriginalSize({ width: shape.width(), height: shape.height() });
    }
  }, []);

  const radius = Math.min(node.width, node.height) / Math.sqrt(3);
  const scaleX = node.width / radius;
  const scaleY = node.height / radius;
  return (
    <RegularPolygon
      ref={polygonRef}
      radius={radius}
      sides={4}
      fill={node.fillColor}
      stroke={node.strokeColor}
      strokeWidth={node.strokeWidth}
      strokeScaleEnabled={false}
      scaleX={scaleX}
      scaleY={scaleY}
    />
  );
};

export default PolygonShape;
