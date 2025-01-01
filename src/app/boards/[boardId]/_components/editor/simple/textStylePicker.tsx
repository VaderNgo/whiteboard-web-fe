import { useContext } from "react";
import { cn } from "@/lib/utils";
import { BoardContext, EditorTab } from "../../../_contexts/boardContext";
import { Hint } from "@/components/hint";
import useSocket from "../../../_hooks/useSocket";

type TextStylePickerProps = {
  top: number;
  left: number;
  activeTab: EditorTab | null;
};

const TextStylePicker = ({ top, left, activeTab }: TextStylePickerProps) => {
  const { selectedNode, setNodes, setUndoStack } = useContext(BoardContext);
  const { updateNode } = useSocket();

  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#FFFFFF", // White
    "transparent",
  ];

  const handleTextColorChange = (color: string) => {
    if (selectedNode) {
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        updatedNode.text.textColor = color;
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  const handleHighlightColorChange = (color: string) => {
    if (selectedNode) {
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        updatedNode.text.hightlightColor = color;
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  return (
    <div
      className={cn(
        "z-10 w-fit h-fit flex-col bg-white rounded-md shadow-md p-3 gap-3",
        activeTab === EditorTab.TEXT_STYLE ? "flex" : "hidden"
      )}
      style={{ position: "absolute", left: `${left}px`, top: `${top}px` }}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-sm text-gray-600 mb-2">Text Color</div>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <Hint key={`text-${color}`} label={color === "transparent" ? "No Color" : color}>
                <div
                  onClick={() => handleTextColorChange(color)}
                  className={cn(
                    "w-6 h-6 rounded cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-500",
                    selectedNode?.text?.textColor === color && "ring-2 ring-blue-500"
                  )}
                  style={{
                    backgroundColor: color,
                    backgroundImage:
                      color === "transparent"
                        ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                        : "none",
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 4px 4px",
                  }}
                />
              </Hint>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextStylePicker;
