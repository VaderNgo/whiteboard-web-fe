import Konva from "konva";
import { useContext, useEffect } from "react";
import { Rect } from "react-konva";
import { BoardContext, Node } from "../../_contexts/boardContext";
import { Anchor } from "./anchor";
type NoteShapeProps = {
  node: Node;
  isHovering: boolean;
};

const NoteShape = ({ node, isHovering }: NoteShapeProps) => {
  const { boardAction } = useContext(BoardContext);
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
      <Rect
        width={node.width}
        height={node.height}
        fill={node.fillColor}
        shadowEnabled={true}
        shadowColor={"#848484"}
        shadowBlur={20}
        shadowOpacity={1}
        shadowOffsetY={10}
        shadowOffsetX={0}
        onTransform={handleTransform}
      />
    </>
  );
};

export default NoteShape;
