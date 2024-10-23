import { Circle, Hexagon, Square } from "lucide-react";
import { BoardContext, EditorTab, History, Node, ShapeType } from "../../../_contexts/boardContext";
import { useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SocketContext } from "../../../_contexts/socketContext";
import useSocket from "../../../_hooks/useSocket";

type ShapePickerProps = {
  top: number;
  left: number;
  activeTab: EditorTab | null;
};

export const ShapePicker = ({ top, left, activeTab }: ShapePickerProps) => {
  const { selectedNode, setSelectedNode, nodes, setNodes, setUndoStack } = useContext(BoardContext);
  const { updateNode } = useSocket();

  useEffect(() => {}, [selectedNode]);
  let shapePickerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
  };

  const handleShapeTypeChange = (type: ShapeType) => {
    if (selectedNode) {
      const currNode = new Node().setAttrs({ ...selectedNode });
      setUndoStack((prev) => {
        const newHistory = { action: "update", nodeData: currNode, type: "node" };
        return [...prev, newHistory as History];
      });
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        updatedNode.shapeType = type;
        updatedNode.calculateAnchorPoints();
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  return (
    <>
      <div
        className={cn(
          "z-10 w-fit h-fit flex-row gap-x-2 bg-white rounded-md shadow-md px-3.5 py-2 justify-center items-center",
          activeTab === EditorTab.SHAPE_PICKER ? "flex" : "hidden"
        )}
        style={shapePickerStyle}
      >
        <div className="flex flex-col gap-y-2">
          <Circle onClick={() => handleShapeTypeChange("Ellipse")} className="cursor-pointer" />
          <Square onClick={() => handleShapeTypeChange("Rect")} className="cursor-pointer" />
          <Hexagon onClick={() => handleShapeTypeChange("Polygon")} className="cursor-pointer" />
          <Hexagon />
        </div>
        <div className="flex flex-col gap-y-2">
          <Circle />
          <Square />
          <Hexagon />
          <Hexagon />
        </div>
        <div className="flex flex-col gap-y-2">
          <Circle />
          <Square />
          <Hexagon />
          <Hexagon />
        </div>
      </div>
    </>
  );
};
