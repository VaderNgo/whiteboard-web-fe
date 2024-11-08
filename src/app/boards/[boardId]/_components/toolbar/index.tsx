import {
  Circle,
  Diamond,
  Hand,
  Hexagon,
  MessageSquareMore,
  MinusIcon,
  MousePointer2,
  MoveUpRightIcon,
  PencilIcon,
  Pentagon,
  Redo2Icon,
  Shapes,
  Square,
  StickyNoteIcon,
  Trash,
  TrendingUpIcon,
  Triangle,
  Type,
  Undo2Icon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { BoardAction, BoardContext, History, Node, Path } from "../../_contexts/boardContext";
import useSocket from "../../_hooks/useSocket";
import { ToolButton } from "./tool-button";

import useHistory from "../../_hooks/useHistory";

const Toolbar = () => {
  const {
    nodes,
    setNodes,
    selectedNode,
    selectedShapes,
    setSelectedNode,
    setSelectedShapes,
    shapeType,
    setShapeType,
    canDragStage,
    setCanDragStage,
    boardAction,
    setBoardAction,
    setSelectedPath,
    selectedPath,
    setUndoStack,
    setPaths,
  } = useContext(BoardContext);
  const { handleRedo, handleUndo } = useHistory();
  const { updateNode, updatePath } = useSocket();

  enum ToolButtonState {
    Select = "select",
    Drag = "drag",
    Text = "text",
    Note = "note",
    Shapes = "shapes",
    Rectangle = "rectangle",
    Ellipse = "ellipse",
    Triangle = "triangle",
    Pentagon = "pentagon",
    Diamond = "diamond",
    Hexagon = "hexagon",
    Line = "line",
    ArrowLine = "arrow-line",
    ArrowLine2 = "arrow-line-2",
    Pencil = "pencil",
    Connection = "connection",
  }
  const [selectState, setSelectState] = useState<ToolButtonState>(ToolButtonState.Select);
  const [isShapesOpen, setIsShapesOpen] = useState(false);
  const handleNodeDelete = () => {
    if (selectedNode) {
      const node = new Node().setAttrs({ ...selectedNode, deleted: true });
      setNodes((prev) => {
        return new Map(prev.set(node.id, node));
      });
      updateNode(node.id, node);
      setUndoStack((prev) => {
        const newHistory = { action: "delete", nodeData: node, type: "node" };
        return [...prev, newHistory as History];
      });
    } else if (selectedPath) {
      const path = new Path().setAttrs({ ...selectedPath, deleted: true });
      setPaths((prev) => {
        const updatedPath = prev.get(path.id);
        if (!updatedPath) return prev;
        updatedPath.setAttrs({ deleted: true });
        return new Map(prev.set(path.id, updatedPath));
      });
      updatePath(path.id, path);
      setUndoStack((prev) => {
        const newHistory = { action: "delete", pathData: path, type: "path" };
        return [...prev, newHistory as History];
      });
    }

    setSelectedPath(null);
    setSelectedNode(null);
    setSelectedShapes([]);
  };

  const handleToolButtonClick = (tool: ToolButtonState) => {
    setCanDragStage(false);
    if (
      [
        ToolButtonState.Rectangle,
        // ToolButtonState.Shapes,
        ToolButtonState.Ellipse,
      ].includes(tool)
    ) {
      setBoardAction(BoardAction.DrawShape);
    } else if (
      [
        ToolButtonState.Line,
        // ToolButtonState.Shapes,
        ToolButtonState.ArrowLine,
        ToolButtonState.ArrowLine2,
      ].includes(tool)
    ) {
      setBoardAction(BoardAction.DrawLine);
    }
    setSelectState(tool);
    switch (tool) {
      case ToolButtonState.Select:
        setBoardAction(BoardAction.Select);
        break;
      case ToolButtonState.Drag:
        setBoardAction(BoardAction.Drag);
        setCanDragStage(true);
        break;
      case ToolButtonState.Rectangle:
        setShapeType("Rect");
        break;
      case ToolButtonState.Ellipse:
        setShapeType("Ellipse");
        break;
      case ToolButtonState.Line:
        // setShapeType("");
        break;
    }
  };

  useEffect(() => {
    if (boardAction === BoardAction.Select) setSelectState(ToolButtonState.Select);
    else if (boardAction === BoardAction.Drag) {
      setSelectState(ToolButtonState.Drag);
      setCanDragStage(true);
    }
  }, [boardAction]);

  return (
    <>
      {true && (
        <div className="z-10 absolute top-[50%] -translate-y-[50%] left-20 flex flex-col bg-white">
          <div className="bg-white rouned-md px-1.5 pt-1.5 flex flex-row items-center">
            <ToolButton
              label="Line"
              icon={MinusIcon}
              side="top"
              onClick={() => handleToolButtonClick(ToolButtonState.Line)}
              isActive={selectState === ToolButtonState.Line}
            />
            <ToolButton
              label="Arrow Line"
              side="top"
              icon={MoveUpRightIcon}
              onClick={() => setSelectState(ToolButtonState.ArrowLine)}
              isActive={selectState === ToolButtonState.ArrowLine}
            />
            <ToolButton
              label="Arrow Line 2"
              side="top"
              icon={TrendingUpIcon}
              onClick={() => setSelectState(ToolButtonState.ArrowLine2)}
              isActive={selectState === ToolButtonState.ArrowLine2}
            />
          </div>
          <hr className="w-[80%] border-black opacity-55 m-auto p-0.5" />
          <div className="bg-white rouned-md px-1.5 flex flex-row items-center">
            <ToolButton
              label="Rectangle"
              side="top"
              icon={Square}
              onClick={() => handleToolButtonClick(ToolButtonState.Rectangle)}
              isActive={selectState === ToolButtonState.Rectangle}
            />
            <ToolButton
              label="Ellipse"
              side="top"
              icon={Circle}
              onClick={() => setSelectState(ToolButtonState.Ellipse)}
              isActive={selectState === ToolButtonState.Ellipse}
            />
            <ToolButton
              label="Hexagon"
              side="top"
              icon={Hexagon}
              onClick={() => setSelectState(ToolButtonState.Hexagon)}
              isActive={selectState === ToolButtonState.Hexagon}
            />
          </div>
          <div className="bg-white rouned-md px-1.5 pb-1.5 flex flex-row items-center">
            <ToolButton
              label="Pentagon"
              side="top"
              icon={Pentagon}
              onClick={() => setSelectState(ToolButtonState.Pentagon)}
              isActive={selectState === ToolButtonState.Pentagon}
            />
            <ToolButton
              label="Triangle"
              side="top"
              icon={Triangle}
              onClick={() => setSelectState(ToolButtonState.Triangle)}
              isActive={selectState === ToolButtonState.Triangle}
            />
            <ToolButton
              label="Diamond"
              side="top"
              icon={Diamond}
              onClick={() => setSelectState(ToolButtonState.Diamond)}
              isActive={selectState === ToolButtonState.Diamond}
            />
          </div>
        </div>
      )}
      <div className="z-10 absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
        <div className="bg-white rouned-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
          <ToolButton
            label="Select"
            icon={MousePointer2}
            onClick={() => handleToolButtonClick(ToolButtonState.Select)}
            isActive={selectState === ToolButtonState.Select || boardAction === BoardAction.Select}
          />
          <ToolButton
            label="Drag"
            icon={Hand}
            onClick={() => {
              handleToolButtonClick(ToolButtonState.Drag);
            }}
            isActive={selectState === ToolButtonState.Drag}
          />
          <ToolButton
            label="Text"
            icon={Type}
            onClick={() => setSelectState(ToolButtonState.Text)}
            isActive={selectState === ToolButtonState.Text}
          />
          <ToolButton
            label="Sticky Note"
            icon={StickyNoteIcon}
            onClick={() => setSelectState(ToolButtonState.Note)}
            isActive={selectState === ToolButtonState.Note}
          />
          <ToolButton
            label="Shapes"
            icon={Shapes}
            onClick={() => handleToolButtonClick(ToolButtonState.Shapes)}
            isActive={selectState === ToolButtonState.Shapes}
          />
          <ToolButton
            label="Pen"
            icon={PencilIcon}
            onClick={() => setSelectState(ToolButtonState.Pencil)}
            isActive={selectState === ToolButtonState.Pencil}
          />
          <ToolButton
            label="Comment"
            icon={MessageSquareMore}
            onClick={() => {}}
            isActive={false}
          />
        </div>
        <div className="z-10 bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
          <ToolButton label="Undo" icon={Undo2Icon} onClick={() => handleUndo()} isActive={false} />
          <ToolButton label="Redo" icon={Redo2Icon} onClick={() => handleRedo()} isActive={false} />
          <ToolButton label="Redo" icon={Trash} onClick={handleNodeDelete} isActive={false} />
        </div>
      </div>
    </>
  );
};

export default Toolbar;
