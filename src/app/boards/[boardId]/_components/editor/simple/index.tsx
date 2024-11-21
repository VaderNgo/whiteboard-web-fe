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
import { useContext, useEffect, useState } from "react";
import { BoardContext, EditorTab } from "../../../_contexts/boardContext";
import useSocket from "../../../_hooks/useSocket";
import { ShapePicker } from "./shapePicker";

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
  } = useContext(BoardContext);
  // const { addToHistory } = useHistory();
  const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null);
  const [editorSize, setEditorSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);
  const [shapeSize, setShapeSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [activeTab, setActiveTab] = useState<EditorTab | null>(null);

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

  return (
    <>
      <ShapePicker top={tabTop} left={left} activeTab={activeTab} />
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
          <Hint label="Align" side="top" sideOffset={10}>
            <AlignCenter />
          </Hint>
          <Hint label="Insert Link" side="top" sideOffset={10}>
            <Link />
          </Hint>
        </div>
        <div
          className="flex flex-row justify-center items-center cursor-pointer gap-5"
          onClick={() => {
            handleEditorValueChange("textColor", "red");
          }}
        >
          <Hint label="Text Color" side="top" sideOffset={10}>
            <div className="flex flex-col h-full justify-center items-center">
              <span className="font-bold text-black text-md">A</span>
              <div className="w-[25px] h-[5px] bg-black mb-0"></div>
            </div>
          </Hint>
          <Hint label="Highlighter Color" side="top" sideOffset={10}>
            <div className="flex flex-col h-full justify-center items-center">
              <Highlighter className="" />
              <div className="w-[25px] h-[5px] bg-black bottom-0"></div>
            </div>
          </Hint>
        </div>

        <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
          <Hint label="Border Style, Opacity, Color">
            <div className="flex flex-col justify-center items-center">
              <div className="size-[25px] rounded-full bg-red-500 flex flex-row justify-center items-center caret-transparent">
                <div className="size-[15px] rounded-full bg-white caret-transparent"></div>
              </div>
            </div>
          </Hint>
          <Hint side="top" sideOffset={10} label="Set color and opacity">
            <div className="flex flex-col justify-center items-center">
              <div className="size-[25px] rounded-full bg-yellow-400 flex flex-row justify-center items-center caret-transparent"></div>
            </div>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default SimpleEditor;
