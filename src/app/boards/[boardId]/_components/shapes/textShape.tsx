import Konva from "konva";
import { useEffect } from "react";
import { Rect } from "react-konva";
import { Node } from "../../_contexts/boardContext";
type TextShapeProps = {
  node: Node;
  isHovering: boolean;
};

const TextShape = ({ node, isHovering }: TextShapeProps) => {
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
      <Rect width={node.width} height={node.height} onTransform={handleTransform} />
    </>
  );
};

export default TextShape;
