import React, { useContext, useState } from "react";
import { Group, Image, Shape } from "react-konva";
import useImage from "use-image";
import { BoardContext, Node } from "../../_contexts/boardContext";
import useHistory from "../../_hooks/useHistory";
import useSocket from "../../_hooks/useSocket";

type EdgeProps = {
  node: Node;
  currNodeChildren: Node;
  color: string;
};

const Edge: React.FunctionComponent<EdgeProps> = ({ node, currNodeChildren, color }) => {
  const RADIUS = 50;
  const SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  const IMG_URL = `data:image/svg+xml;base64,${window.btoa(SVG)}`;

  const { nodes, setNodes, stageRef } = useContext(BoardContext);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [edgeDeleteBtn] = useImage(IMG_URL);
  const { addToHistory } = useHistory();
  const { updateBoard } = useSocket();

  const handleClick = () => {
    setNodes((prevNodes) => {
      const updatedNodes = new Map(prevNodes);
      const currNode = nodes.get(node.id);
      const childNode = nodes.get(currNodeChildren.id);

      if (currNode && childNode) {
        const updatedCurrNode = {
          ...currNode,
          children: currNode.children.filter((child) => child.id !== currNodeChildren.id),
        };
        updatedNodes.set(currNode.id, updatedCurrNode as Node);
        const updatedChildNode = {
          ...childNode,
          parents: childNode.parents.filter((parent) => parent !== currNode.id),
        };
        updatedNodes.set(childNode.id, updatedChildNode as Node);
        addToHistory({
          type: "update",
          diff: null,
          nodes: updatedNodes,
        });
        // saveUpdatedNodes([updatedCurrNode, updatedChildNode]).catch((err) => console.log(err));
        updateBoard([updatedCurrNode as Node, updatedChildNode as Node], "update");
      }
      return updatedNodes;
    });
  };

  const points = [node, currNodeChildren];
  const width = points[1].x - points[0].x;
  const height = points[1].y - points[0].y;
  const yDir = Math.sign(height);
  const xDir = Math.sign(width);
  const radius = Math.min(Math.abs(width / 2), Math.abs(height / 2));

  const getXImage = () => {
    if (Math.abs(width) > Math.abs(height)) {
      return points[0].x + width / 2;
    }
    return (points[0].x + points[1].x) / 2;
  };

  const getYImage = () => {
    if (Math.abs(width) < Math.abs(height)) {
      return points[0].y + height / 2;
    }
    return (points[0].y + points[1].y) / 2;
  };

  return (
    <Group onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)}>
      <Shape
        key={`line_${node.id}_${currNodeChildren.id}`}
        points={points}
        sceneFunc={(context, shape) => {
          if (Math.abs(width) > Math.abs(height)) {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[0].x + width / 2 - RADIUS * xDir, points[0].y);
            context.quadraticCurveTo(
              points[0].x + width / 2,
              points[0].y,
              points[0].x + width / 2,
              points[0].y + yDir * radius
            );
            context.lineTo(points[0].x + width / 2, points[1].y - yDir * radius);
            context.quadraticCurveTo(
              points[0].x + width / 2,
              points[1].y,
              points[0].x + width / 2 + radius * xDir,
              points[1].y
            );
          } else {
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[0].x, points[0].y + height / 2 - RADIUS * yDir);
            context.quadraticCurveTo(
              points[0].x,
              points[0].y + height / 2,
              points[0].x + xDir * radius,
              points[0].y + height / 2
            );
            context.lineTo(points[1].x - xDir * radius, points[0].y + height / 2);
            context.quadraticCurveTo(
              points[1].x,
              points[0].y + height / 2,
              points[1].x,
              points[0].y + height / 2 + radius * yDir
            );
          }
          context.lineTo(points[1].x, points[1].y);
          context.fillStrokeShape(shape);
        }}
        stroke={color}
        strokeWidth={isMouseOver ? 6 : 4}
        // dash={[8, 4]}
      />
      {isMouseOver && (
        <Image
          key={`deleteBtn_${node.id}_${currNodeChildren.id}`}
          onClick={() => {
            setIsMouseOver(false);
            setButtonHover(false);
            const container = stageRef?.current?.container();
            if (container) container.style.cursor = "auto";
            handleClick();
          }}
          onMouseOver={() => {
            setButtonHover(true);
            const container = stageRef?.current?.container();
            if (container) container.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            setButtonHover(false);
            const container = stageRef?.current?.container();
            if (container) container.style.cursor = "auto";
          }}
          scaleX={buttonHover ? 1.2 : 1}
          scaleY={buttonHover ? 1.2 : 1}
          offsetX={20}
          offsetY={20}
          x={getXImage()}
          y={getYImage()}
          width={40}
          height={40}
          image={edgeDeleteBtn}
        />
      )}
    </Group>
  );
};

export default Edge;
