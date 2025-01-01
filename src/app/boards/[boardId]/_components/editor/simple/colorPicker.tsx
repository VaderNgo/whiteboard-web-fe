import { cn } from "@/lib/utils";
import { BoardContext, EditorTab, History, Node } from "../../../_contexts/boardContext";
import { useContext } from "react";
import useSocket from "../../../_hooks/useSocket";

type ColorPickerProps = {
  top: number;
  left: number;
  activeTab: EditorTab | null;
  type: "fill" | "stroke";
};

export const ColorPicker = ({ top, left, activeTab, type }: ColorPickerProps) => {
  const { selectedNode, setSelectedNode, nodes, setNodes, setUndoStack } = useContext(BoardContext);
  const { updateNode } = useSocket();

  let colorPickerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
  };

  const colors: string[] = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#000000",
    "#FFFFFF",
    "transparent",
  ];

  const handleColorChange = (color: string) => {
    if (selectedNode) {
      const currNode = new Node().setAttrs({ ...selectedNode });
      setUndoStack((prev) => {
        const newHistory = { action: "update", nodeData: currNode, type: "node" };
        return [...prev, newHistory as History];
      });
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        if (type === "fill") {
          updatedNode.fillColor = color;
        } else {
          updatedNode.strokeColor = color;
        }
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  const handleStrokeWidthChange = (width: number) => {
    if (selectedNode) {
      const currNode = new Node().setAttrs({ ...selectedNode });
      setUndoStack((prev) => {
        const newHistory = { action: "update", nodeData: currNode, type: "node" };
        return [...prev, newHistory as History];
      });
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        updatedNode.strokeWidth = width;
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  const getTabType = (type: "fill" | "stroke"): EditorTab => {
    return type === "fill" ? EditorTab.FILL_COLOR : EditorTab.STROKE_COLOR;
  };

  return (
    <div
      className={cn(
        "z-10 w-fit h-fit flex-col bg-white rounded-md shadow-md p-3 gap-3",
        activeTab === getTabType(type) ? "flex" : "hidden"
      )}
      style={colorPickerStyle}
    >
      <div className="text-sm text-gray-600 mb-2">
        {type === "fill" ? "Fill Node Color" : "Stroke Edit"}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorChange(color)}
            className={cn(
              "w-6 h-6 rounded cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-500",
              (type === "fill" ? selectedNode?.fillColor : selectedNode?.strokeColor) === color &&
                "ring-2 ring-blue-500"
            )}
            style={{
              backgroundColor: color,
              backgroundImage:
                color === "transparent"
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                  : "none",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 4px 4px",
            }}
          />
        ))}
      </div>

      {type === "stroke" && (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-600">Stroke Width</div>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min="0"
              max="20"
              value={selectedNode?.strokeWidth || 2}
              onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
              className="w-24"
            />
            <input
              type="number"
              min="0"
              max="20"
              value={selectedNode?.strokeWidth || 2}
              onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
              className="w-16 h-8 px-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
