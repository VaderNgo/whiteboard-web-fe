import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  Bold,
  Circle,
  Diamond,
  Italic,
  Square,
  Triangle,
  WholeWord,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { BoardContext, EditorTab } from "../../../_contexts/boardContext";
import { ShapePicker } from "./shapePicker";
import ColorPicker from "./colorPicker";
import TextStylePicker from "./textStylePicker";
import TextAlignmentPicker from "./textAlignmentPicker";
import { useLoggedInUser } from "@/lib/services/queries";
import { Permission } from "@/lib/permission-enum";
import { motion, AnimatePresence } from "framer-motion";

const SimpleEditor = () => {
  const {
    selectedNode,
    editorValue,
    setEditorValue,
    stageRef,
    stageConfig,
    selectedShapes,
    usersBoard,
  } = useContext(BoardContext);
  const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null);
  const [editorSize, setEditorSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);
  const [shapeSize, setShapeSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [activeTab, setActiveTab] = useState<EditorTab | null>(null);
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
  }, [selectedNode, stageRef, editorRef, stageConfig]);

  if (!selectedNode || !editorPosition || isViewOnly()) return null;

  let left = editorPosition.left + Math.floor(shapeSize.w / 2) - Math.floor(editorSize.w / 2);
  let top = editorPosition.top - 120;
  const viewportHeight = window.innerHeight;

  if (top <= Math.floor(viewportHeight / 3)) {
    top = top + shapeSize.h + 170;
  }

  let tabTop = top + 50;

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
    <AnimatePresence>
      {selectedNode && selectedShapes.length === 1 && (
        <>
          <ShapePicker top={tabTop} left={left} activeTab={activeTab} />
          <ColorPicker top={top + 50} left={left + 350} activeTab={activeTab} type="fill" />
          <ColorPicker top={top + 50} left={left + 350} activeTab={activeTab} type="stroke" />
          <TextStylePicker top={top + 50} left={left + 250} activeTab={activeTab} />
          <TextAlignmentPicker top={top + 50} left={left} activeTab={activeTab} />

          <motion.div
            ref={setEditorRef}
            className={cn(
              "z-10 absolute flex w-fit h-fit flex-row bg-white p-2 px-7 gap-5 items-center rounded-md shadow-md"
            )}
            style={{ left, top }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {selectedNode.shapeType != "Note" && (
              <Hint label="shape" side="top" sideOffset={10}>
                <motion.div
                  className="flex flex-row justify-center items-center cursor-pointer"
                  onClick={() => handleTabChange(EditorTab.SHAPE_PICKER)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedNode.shapeType === "Rect" && <Square />}
                  {selectedNode.shapeType === "Ellipse" && <Circle />}
                  {selectedNode.shapeType === "Polygon" && selectedNode.sides == 3 && <Triangle />}
                  {selectedNode.shapeType === "Polygon" && selectedNode.sides == 4 && <Diamond />}
                </motion.div>
              </Hint>
            )}

            <Hint label="font" side="top" sideOffset={10}>
              <motion.div
                className="flex flex-row justify-center items-center cursor-pointer"
                onClick={() => handleTabChange(EditorTab.FONT_FAMILY)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{editorValue.text?.fontFamily}</span>
              </motion.div>
            </Hint>

            <Hint label="font size" side="top" sideOffset={10}>
              <motion.div
                className="flex flex-row justify-center items-center"
                whileHover={{ scale: 1.05 }}
              >
                <input
                  defaultValue={editorValue.text?.fontSize}
                  type="number"
                  min={1}
                  className="w-[50px]"
                  onChange={(e) => handleEditorValueChange("fontSize", Number(e.target.value))}
                />
              </motion.div>
            </Hint>

            <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
              <Hint label={"Font Style: " + selectedNode.text.fontStyle} side="top" sideOffset={10}>
                <motion.div
                  className="flex flex-row justify-center items-center"
                  onClick={handleFontStyleToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedNode.text.fontStyle === "normal" && <WholeWord />}
                  {selectedNode.text.fontStyle === "italic" && <Italic size={23} />}
                  {selectedNode.text.fontStyle === "bold" && <Bold />}
                </motion.div>
              </Hint>

              <Hint label="Text Alignment" side="top" sideOffset={10}>
                <motion.div
                  className="flex flex-row justify-center items-center cursor-pointer"
                  onClick={() => handleTabChange(EditorTab.TEXT_ALIGN)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AlignCenter />
                </motion.div>
              </Hint>
            </div>

            <Hint label="Text Style" side="top" sideOffset={10}>
              <motion.div
                className="flex flex-col h-full justify-center items-center cursor-pointer"
                onClick={() => handleTabChange(EditorTab.TEXT_STYLE)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-bold text-black text-md">A</span>
                <div
                  className="w-[25px] h-[5px]"
                  style={{ backgroundColor: selectedNode?.text?.textColor || "black" }}
                />
              </motion.div>
            </Hint>

            <div className="flex flex-row justify-center items-center gap-5">
              <Hint label="Fill Color">
                <motion.div
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              </Hint>

              <Hint label="Stroke Color">
                <motion.div
                  className="w-6 h-6 rounded cursor-pointer border border-gray-300"
                  style={{
                    backgroundColor: selectedNode?.strokeColor || "black",
                  }}
                  onClick={() => handleTabChange(EditorTab.STROKE_COLOR)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              </Hint>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SimpleEditor;
