import React from "react";
import { RegularPolygon } from "react-konva";
import { Node } from "../../_contexts/boardContext";

type PolygonShapeProps = {
    node: Node;
};

const PolygonShape = ({ node }: PolygonShapeProps) => {
    return (
        <RegularPolygon
            radius={node.width / 2}
            sides={4}
            fill={node.fillStyle}
            stroke={node.strokeStyle}
            strokeWidth={5}
        />
    );
};

export default PolygonShape;
