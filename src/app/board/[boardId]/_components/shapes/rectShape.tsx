import React from "react";
import { Rect } from "react-konva";
import { Node } from "../../_contexts/boardContext";

type RectShapeProps = {
    node: Node;
};

const RectShape = ({ node }: RectShapeProps) => {
    return (
        <Rect
            width={node.width}
            height={node.height}
            fill={node.fillStyle}
            stroke={node.strokeStyle}
            strokeWidth={5}
            cornerRadius={20}
        />
    );
};

export default RectShape;
