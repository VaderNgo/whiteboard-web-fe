import React from "react";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import { BoardContext, EditorTab } from "../../../_contexts/boardContext";
import { Hint } from "@/components/hint";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import useSocket from "../../../_hooks/useSocket";

interface TextAlignmentPickerProps {
  top: number;
  left: number;
  activeTab: EditorTab | null;
}

interface AlignButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const TextAlignmentPicker: React.FC<TextAlignmentPickerProps> = ({ top, left, activeTab }) => {
  const { selectedNode, setNodes } = useContext(BoardContext);
  const { updateNode } = useSocket();

  const handleHorizontalAlignChange = (align: "left" | "center" | "right" | "justify") => {
    if (selectedNode) {
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        updatedNode.text.align = align;
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  const handleVerticalAlignChange = (align: "top" | "middle" | "bottom") => {
    if (selectedNode) {
      setNodes((prevState) => {
        const updatedNode = prevState.get(selectedNode.id);
        if (!updatedNode) return prevState;
        updatedNode.text.verticalAlign = align;
        updateNode(updatedNode.id, updatedNode);
        return new Map(prevState.set(selectedNode.id, updatedNode));
      });
    }
  };

  const AlignButton: React.FC<AlignButtonProps> = ({ onClick, icon: Icon, label, isActive }) => (
    <Hint label={label}>
      <div
        onClick={onClick}
        className={cn(
          "p-2 rounded hover:bg-gray-100 cursor-pointer",
          isActive && "bg-blue-100 hover:bg-blue-200"
        )}
      >
        <Icon className={cn("w-5 h-5", isActive && "text-blue-600")} />
      </div>
    </Hint>
  );

  return (
    <div
      className={cn(
        "z-10 w-fit h-fit flex-col bg-white rounded-md shadow-md p-3 gap-4",
        activeTab === EditorTab.TEXT_ALIGN ? "flex" : "hidden"
      )}
      style={{ position: "absolute", left: `${left}px`, top: `${top}px` }}
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-600 mb-1">Horizontal Alignment</div>
        <div className="flex gap-2">
          <AlignButton
            onClick={() => handleHorizontalAlignChange("left")}
            icon={AlignLeft}
            label="Align Left"
            isActive={selectedNode?.text?.align === "left"}
          />
          <AlignButton
            onClick={() => handleHorizontalAlignChange("center")}
            icon={AlignCenter}
            label="Align Center"
            isActive={selectedNode?.text?.align === "center"}
          />
          <AlignButton
            onClick={() => handleHorizontalAlignChange("right")}
            icon={AlignRight}
            label="Align Right"
            isActive={selectedNode?.text?.align === "right"}
          />
          <AlignButton
            onClick={() => handleHorizontalAlignChange("justify")}
            icon={AlignJustify}
            label="Justify"
            isActive={selectedNode?.text?.align === "justify"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm text-gray-600 mb-1">Vertical Alignment</div>
        <div className="flex gap-2">
          <AlignButton
            onClick={() => handleVerticalAlignChange("top")}
            icon={AlignVerticalJustifyStart}
            label="Align Top"
            isActive={selectedNode?.text?.verticalAlign === "top"}
          />
          <AlignButton
            onClick={() => handleVerticalAlignChange("middle")}
            icon={AlignVerticalJustifyCenter}
            label="Align Middle"
            isActive={selectedNode?.text?.verticalAlign === "middle"}
          />
          <AlignButton
            onClick={() => handleVerticalAlignChange("bottom")}
            icon={AlignVerticalJustifyEnd}
            label="Align Bottom"
            isActive={selectedNode?.text?.verticalAlign === "bottom"}
          />
        </div>
      </div>
    </div>
  );
};

export default TextAlignmentPicker;
