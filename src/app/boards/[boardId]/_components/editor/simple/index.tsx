import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  Bold,
  Circle,
  Highlighter,
  Italic,
  Link,
  Square,
  WholeWord,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { BoardContext, EditorTab, Node } from "../../../_contexts/boardContext";
import { ShapePicker } from "./shapePicker";
import ColorPicker from "./colorPicker";
import useSocket from "../../../_hooks/useSocket";
import TextStylePicker from "./textStylePicker";
import TextAlignmentPicker from "./textAlignmentPicker";
import { useLoggedInUser } from "@/lib/services/queries";
import { Permission } from "@/lib/permission-enum";

const SimpleEditor = () => {
  const {
    selectedNode,
    editorValue,
    setEditorValue,
    stageRef,
    stageStyle,
    stageConfig,
    selectedShapes,
    setNodes,
    setUndoStack,
    usersBoard,
  } = useContext(BoardContext);
  const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null);
  const [editorSize, setEditorSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);
  const [shapeSize, setShapeSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [activeTab, setActiveTab] = useState<EditorTab | null>(null);
  const { updateNode } = useSocket();
  const user = useLoggedInUser();
  const isViewOnly = useCallback(() => {
    if (!user?.data?.id) return false;
    const userPermission = usersBoard.get(user.data.id.toString())?.permission;
    return userPermission === Permission.VIEW;
  }, [user, usersBoard]);
  useEffect(() => {
    if (selectedShapes.length !== 1) {
      setActiveTab(null);
    }

    if (selectedNode && stageRef && stageRef.current && selectedShapes.length === 1) {
      const stage = stageRef.current;
      const stageRect = stage.container().getBoundingClientRect();
      const groupRect = selectedShapes[0].getClientRect();
      setShapeSize({ w: groupRect.width, h: groupRect.height });
      setEditorPosition({
        left: groupRect.x + stageRect.left,
        top: groupRect.y + stageRect.top,
      });
    }

    if (editorRef) {
      setEditorSize({ w: editorRef.clientWidth, h: editorRef.clientHeight });
    }
  }, [selectedNode, stageRef, editorRef, stageConfig, stageStyle]);

  if (!selectedNode || !editorPosition) return null;

  let left = editorPosition.left + Math.floor(shapeSize.w / 2) - Math.floor(editorSize.w / 2);
  let top = editorPosition.top - 120;
  const viewportHeight = window.innerHeight;

  if (top <= Math.floor(viewportHeight / 3)) {
    top = top + shapeSize.h + 170;
  }

  let tabTop = top + 50;
  let editorStyle: React.CSSProperties = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
  };

  const handleTabChange = (tab: EditorTab) => {
    if (activeTab === tab) {
      setActiveTab(null);
      return;
    }
    setActiveTab(tab);
  };

  const handleFontStyleToggle = () => {
    let newFontStyle;
    switch (selectedNode.text.fontStyle) {
      case "normal":
        newFontStyle = "bold";
        break;
      case "bold":
        newFontStyle = "italic";
        break;
      case "italic":
        newFontStyle = "normal";
        break;
    }
    handleEditorValueChange("fontStyle", newFontStyle);
  };

  const handleEditorValueChange = (key: string, value: any) => {
    let node = editorValue.node;
    let text = editorValue.text;
    if (node && text) {
      if (["fontSize", "fontFamily", "textColor", "fontStyle"].includes(key))
        text.setAttrs({ [key]: value });
      else node.setAttrs({ [key]: value });
    }
    setEditorValue({ node, text });
  };

  if (isViewOnly()) return null;

  return (
    <>
      <ShapePicker top={tabTop} left={left} activeTab={activeTab} />
      <ColorPicker top={top + 50} left={left + 350} activeTab={activeTab} type="fill" />
      <ColorPicker top={top + 50} left={left + 350} activeTab={activeTab} type="stroke" />
      <TextStylePicker top={top + 50} left={left + 250} activeTab={activeTab} />
      <TextAlignmentPicker top={top + 50} left={left} activeTab={activeTab} />
      <div
        ref={setEditorRef}
        className={cn(
          "z-10 absolute hidden w-fit h-fit flex-row bg-white p-2 px-7 gap-5 items-center rounded-md top-10 left-10 caret-transparent select-none shadow-md",
          selectedNode && selectedShapes.length === 1 && "flex"
        )}
        style={editorStyle}
      >
        {selectedNode.shapeType != "Note" && (
          <Hint label="shape" side="top" sideOffset={10}>
            <div
              className="flex flex-row justify-center items-center cursor-pointer"
              onClick={() => handleTabChange(EditorTab.SHAPE_PICKER)}
            >
              {editorValue.node?.shapeType === "Rect" ? <Square /> : <Circle />}
            </div>
          </Hint>
        )}
        <Hint label="font" side="top" sideOffset={10}>
          <div
            className="flex flex-row justify-center items-center cursor-pointer"
            onClick={() => handleTabChange(EditorTab.FONT_FAMILY)}
          >
            <span>{editorValue.text?.fontFamily}</span>
          </div>
        </Hint>

        <Hint label="font size" side="top" sideOffset={10}>
          <div className="flex flex-row justify-center items-center cursor-pointer">
            <div className="flex flex-row bg-green-500">
              <div className="">
                <input
                  defaultValue={editorValue.text?.fontSize}
                  type="number"
                  min={1}
                  className="w-[50px]"
                  onChange={(e) => handleEditorValueChange("fontSize", Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col bg-red-50"></div>
            </div>
          </div>
        </Hint>

        <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
          <Hint label={"Font Style: " + selectedNode.text.fontStyle} side="top" sideOffset={10}>
            <div
              className="flex flex-row justify-center items-center"
              onClick={() => {
                handleFontStyleToggle();
              }}
            >
              {selectedNode.text.fontStyle === "normal" && (
                <>
                  <WholeWord />
                </>
              )}
              {selectedNode.text.fontStyle === "italic" && (
                <>
                  <Italic size={23} />
                </>
              )}
              {selectedNode.text.fontStyle === "bold" && (
                <>
                  <Bold />
                </>
              )}
            </div>
          </Hint>
          <Hint label="Text Alignment" side="top" sideOffset={10}>
            <div
              className="flex flex-row justify-center items-center cursor-pointer"
              onClick={() => handleTabChange(EditorTab.TEXT_ALIGN)}
            >
              <AlignCenter />
            </div>
          </Hint>
        </div>

        <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
          <Hint label="Text Style" side="top" sideOffset={10}>
            <div
              className="flex flex-col h-full justify-center items-center"
              onClick={() => handleTabChange(EditorTab.TEXT_STYLE)}
            >
              <span className="font-bold text-black text-md">A</span>
              <div
                className="w-[25px] h-[5px]"
                style={{ backgroundColor: selectedNode?.text?.textColor || "black" }}
              />
            </div>
          </Hint>
        </div>

        <div className="flex flex-row justify-center items-center gap-5">
          <Hint label="Fill Color">
            <div
              className="w-6 h-6 rounded cursor-pointer border border-gray-300"
              style={{
                backgroundColor: selectedNode?.fillColor || "transparent",
                backgroundImage:
                  selectedNode?.fillColor === "transparent"
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                    : "none",
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 4px 4px",
              }}
              onClick={() => handleTabChange(EditorTab.FILL_COLOR)}
            />
          </Hint>

          <Hint label="Stroke Color">
            <div
              className="w-6 h-6 rounded cursor-pointer border border-gray-300"
              style={{
                backgroundColor: selectedNode?.strokeColor || "black",
              }}
              onClick={() => handleTabChange(EditorTab.STROKE_COLOR)}
            />
          </Hint>
        </div>
      </div>
    </>
  );
};

export default SimpleEditor;
