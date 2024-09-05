import React from "react";
import { Ellipse } from "react-konva";
import { Node } from "../../_contexts/boardContext";

type EllipseShapeProps = {
    node: Node;
};

const EllipseShape = ({ node }: EllipseShapeProps) => {
    return (
        <Ellipse
            fill={node.fillStyle}
            stroke={node.strokeStyle}
            strokeWidth={5}
            radiusX={node.width / 2}
            radiusY={node.height / 2}
        />
    );
};

export default EllipseShape;
