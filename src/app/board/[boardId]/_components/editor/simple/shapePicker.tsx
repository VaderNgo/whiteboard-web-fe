import { Circle, Hexagon, Square } from "lucide-react";
import { BoardContext, EditorTab, ShapeType } from "../../../_contexts/boardContext";
import { useContext, useEffect } from "react";
import { cn } from "@/lib/utils";

type ShapePickerProps = {
  top: number;
  left: number;
  activeTab: EditorTab | null;
};

export const ShapePicker = ({ top, left, activeTab }: ShapePickerProps) => {
  const { selectedNode, setSelectedNode } = useContext(BoardContext);
  useEffect(() => {}, [selectedNode]);
  let shapePickerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
  };

  const handleShapeTypeChange = (type: ShapeType) => {
    if (selectedNode) {
      selectedNode.shapeType = type;
      selectedNode.calculateAnchorPoints();
    }
    setSelectedNode(null);
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
          <Square />
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
