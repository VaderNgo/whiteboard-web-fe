import Konva from "konva";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Group, Text } from "react-konva";
import { BoardContext, Node, Text as TextNode } from "../../_contexts/boardContext";
import useHistory from "../../_hooks/useHistory";
import useSocket from "../../_hooks/useSocket";
import EllipseShape from "./ellipseShape";
import PolygonShape from "./polygonShape";
import RectShape from "./rectShape";
import { TextEditor } from "../text/textEditor";

type ShapeProps = {
  node: Node;
};

const Shape: React.FC<ShapeProps> = ({ node }) => {
  const {
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    selectedShapes,
    setSelectedShapes,
    stageRef,
    lineStyle,
  } = useContext(BoardContext);
  const shapeRef = useRef<Konva.Group>(null);
  const textRef = useRef<Konva.Text>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { addToHistory } = useHistory();
  const { updateBoard, updateUserMouse } = useSocket();
  const [groupScale, setGroupScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    shapeRef.current?.setAttr("id", node.id);
  }, [node.id]);
  useEffect(() => {}, [selectedNode]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (stageRef) {
      const mouseX = stageRef.current?.getRelativePointerPosition()?.x;
      const mouseY = stageRef.current?.getRelativePointerPosition()?.y;

      if (mouseX && mouseY) {
        updateUserMouse({ x: mouseX, y: mouseY });
      }
    }

    setNodes((prevState) => {
      const { x, y } = e.target.position();
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      const updatedNode = {
        ...currNode,
        x,
        y,
      };
      prevState.set(node.id, updatedNode);
      updateBoard([updatedNode], "update");
      return new Map(prevState);
    });
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setNodes((prevState) => {
      let { x, y } = e.target.position();
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      if (currNode.parents.length > 0) {
        currNode.parents.forEach((parent) => {
          const currParent = nodes.get(parent);
          if (currParent && Math.abs(currParent.x - x) < 30) {
            x = currParent.x;
          } else if (currParent && Math.abs(currParent.y - y) < 30) {
            y = currParent.y;
          }
        });
      }
      if (currNode.children.length > 0) {
        currNode.children.forEach((child) => {
          const currChild = nodes.get(child.id);
          if (currChild && Math.abs(currChild.x - x) < 30) {
            x = currChild.x;
          } else if (currChild && Math.abs(currChild.y - y) < 30) {
            y = currChild.y;
          }
        });
      }
      const updatedNode = {
        ...currNode,
        x,
        y,
      };
      prevState.set(node.id, updatedNode);
      addToHistory({
        type: "update",
        diff: null,
        nodes: prevState,
      });
      updateBoard([updatedNode], "update");
      setSelectedNode(updatedNode);
      //   saveUp([updatedNode]).catch((err) => console.log(err));
      return new Map(prevState);
    });
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.shiftKey) {
      setSelectedNode(null);
      if (selectedShapes.find((shape) => shape._id === shapeRef.current?._id)) {
        setSelectedShapes((prevState) =>
          prevState.filter((shape) => shape._id !== shapeRef.current?._id)
        );
      } else {
        setSelectedShapes((prevState) => [...prevState, shapeRef.current as Konva.Group]);
      }
      return;
    }
    if (selectedNode && selectedNode.id !== node.id) {
      setNodes((prevState) => {
        const selectNode = nodes.get(selectedNode.id);
        const currNode = nodes.get(node.id);
        if (
          currNode &&
          selectNode &&
          !currNode.children.some((child) => child.id === selectedNode.id) &&
          !selectNode.children.some((child) => child.id === currNode.id) &&
          selectedNode.id !== currNode.id
        ) {
          const updatedSelectNode = {
            ...selectNode,
            children: [...selectNode.children, { id: currNode.id, color: lineStyle }],
          };
          prevState.set(selectedNode.id, updatedSelectNode);
          const updatedCurrNode = {
            ...currNode,
            parents: [...currNode.parents, selectedNode.id],
          };
          prevState.set(currNode.id, updatedCurrNode);
          addToHistory({
            type: "update",
            diff: null,
            nodes: prevState,
          });
          // saveUpdatedNodes([updatedSelectNode, updatedCurrNode]).catch((err) => console.log(err));
          updateBoard([updatedSelectNode, updatedCurrNode], "update");
          return new Map(prevState);
        }
        return prevState;
      });
      setSelectedNode(null);
      setSelectedShapes([]);
    } else {
      setSelectedNode(node);
      setSelectedShapes([shapeRef.current as Konva.Group]);
    }
  };
  const handleTransform = () => {
    if (shapeRef.current) {
      const currNode = nodes.get(node.id);
      const currGroup = shapeRef.current;
      setNodes((prevState) => {
        if (!currNode) return prevState;
        const updatedNode = {
          ...currNode,
          x: currGroup.x(),
          y: currGroup.y(),
        };
        prevState.set(node.id, updatedNode);
        updateBoard([updatedNode], "update");
        return new Map(prevState);
      });
      setGroupScale({ x: currGroup.scaleX(), y: currGroup.scaleY() });
    }
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      const currGroup = shapeRef.current;
      const scaleX = currGroup.scaleX();
      const scaleY = currGroup.scaleY();
      currGroup.scaleX(1);
      currGroup.scaleY(1);
      const currNode = nodes.get(node.id);

      setNodes((prevState) => {
        if (!currNode) return prevState;
        const updatedNode = {
          ...currNode,
          width: node.width * scaleX,
          height: node.height * scaleY,
        };
        prevState.set(node.id, updatedNode);
        addToHistory({
          type: "update",
          diff: null,
          nodes: prevState,
        });
        setSelectedNode(updatedNode);
        // saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
        updateBoard([updatedNode], "update");
        return new Map(prevState);
      });
      setGroupScale({ x: 1, y: 1 });
    }
  };
  const onToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const getTextWidth = () => {
    let width = node.width * groupScale.x;
    if (node.shapeType === "Ellipse") {
      return width / Math.sqrt(2);
    }
    if (node.shapeType === "Polygon") {
      return (width / 2) * Math.sqrt(2);
    }
    return width;
  };

  const getTextHeight = () => {
    let height = node.height * groupScale.y;
    if (node.shapeType === "Ellipse") {
      return height / Math.sqrt(2);
    }
    if (node.shapeType === "Polygon") {
      return (height / 2) * Math.sqrt(2);
    }
    return height;
  };

  const getTextX = () => {
    if (node.shapeType === "Ellipse" || node.shapeType === "Polygon") {
      return -(getTextWidth() / 2) * (1 / groupScale.x);
    }
    return 0;
  };

  const getTextY = () => {
    if (node.shapeType === "Ellipse" || node.shapeType === "Polygon") {
      return -(getTextHeight() / 2) * (1 / groupScale.y);
    }
    return 0;
  };

  const handleTextChange = (newContent: string) => {
    setNodes((prevState) => {
      const updatedNode = new Node(
        node.id,
        node.children,
        node.parents,
        new TextNode(
          node.text.id,
          newContent,
          node.text.fontSize,
          node.text.fontFamily,
          node.text.textColor,
          node.text.hightlightColor
        ),
        node.shapeType,
        node.x,
        node.y,
        node.width,
        node.height,
        node.fillStyle,
        node.strokeStyle
      );
      prevState.set(node.id, updatedNode);
      updateBoard([updatedNode], "update");
      return new Map(prevState);
    });
  };

  const handleTextEditingFinish = () => {
    setIsEditing(false);
  };

  return (
    <Group
      ref={shapeRef}
      x={node.x}
      y={node.y}
      offsetX={node.shapeType === "Rect" ? node.width / 2 : 0}
      offsetY={node.shapeType === "Rect" ? node.height / 2 : 0}
      draggable
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
      onDblClick={onToggleEdit}
      name="mindmap-node"
    >
      {isEditing ? (
        <TextEditor
          initialText={node.text.content}
          x={getTextX()}
          y={getTextY() + getTextHeight() / 3}
          width={getTextWidth()}
          height={getTextHeight()}
          fontSize={node.text.fontSize}
          fontFamily={node.text.fontFamily}
          padding={node.shapeType === "Polygon" ? 20 : 10}
          onTextChange={handleTextChange}
          onFinishEditing={handleTextEditingFinish}
        />
      ) : (
        <Text
          ref={textRef}
          text={node.text.content}
          fontSize={node.text.fontSize}
          fontFamily={node.text.fontFamily}
          fill={node.text.textColor}
          onDblClick={onToggleEdit}
          onTap={onToggleEdit}
          padding={node.shapeType === "Polygon" ? 20 : 10}
          align="center"
          verticalAlign="middle"
          strokeScaleEnabled={false}
          scaleX={1 / groupScale.x}
          scaleY={1 / groupScale.y}
          width={getTextWidth()}
          height={getTextHeight()}
          x={getTextX()}
          y={getTextY()}
        />
      )}
      {node.shapeType === "Rect" && <RectShape node={node} />}
      {node.shapeType === "Ellipse" && <EllipseShape node={node} />}
      {node.shapeType === "Polygon" && <PolygonShape node={node} />}
    </Group>
  );
};

export default Shape;
