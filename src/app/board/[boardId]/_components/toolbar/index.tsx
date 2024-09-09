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
import { useContext, useState } from "react";
import { BoardContext, Node } from "../../_contexts/boardContext";
import useSocket from "../../_hooks/useSocket";
import { CanvasMode } from "../../_types/canvas";
import { LayerType } from "../../_types/layer";
import { ToolButton } from "./tool-button";

import useHistory from "../../_hooks/useHistory";
import { Shape } from "react-konva";

const Toolbar = () => {
    const {
        nodes,
        setNodes,
        history,
        historyIndex,
        selectedNode,
        selectedShapes,
        setSelectedNode,
        setSelectedShapes,
        shapeType,
        setShapeType,
        canDragStage,
        setCanDragStage,
    } = useContext(BoardContext);
    const { addToHistory, handleRedo, handleUndo } = useHistory();
    const { deleteBoardNodes } = useSocket();

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
            setNodes((prevState) => {
                const updatedNodesToSave: Node[] = [];
                const updatedNodes = new Map(prevState);
                const currNode = nodes.get(selectedNode.id);
                if (currNode) {
                    currNode.parents.forEach((parent) => {
                        const parentNode = nodes.get(parent);
                        if (parentNode) {
                            const updatedParent = {
                                ...parentNode,
                                children: parentNode.children.filter((child) => child.id !== currNode.id),
                            };
                            updatedNodes.set(parent, updatedParent);
                            updatedNodesToSave.push(updatedParent);
                        }
                    });
                    currNode.children.forEach((child) => {
                        const childNode = nodes.get(child.id);
                        if (childNode) {
                            const updatedChild = {
                                ...childNode,
                                parents: childNode.parents.filter((parent) => parent !== currNode.id),
                            };
                            updatedNodes.set(child.id, updatedChild);
                            updatedNodesToSave.push(updatedChild);
                        }
                    });
                    updatedNodes.delete(currNode.id);
                    addToHistory({
                        type: "delete",
                        diff: [currNode.id],
                        nodes: updatedNodes,
                    });
                    deleteBoardNodes(updatedNodesToSave, [currNode]);
                    // saveDeletedNodes(updatedNodesToSave, [currNode]).catch((err) => console.log(err));
                }
                return updatedNodes;
            });
        } else if (selectedShapes) {
            setNodes((prevState) => {
                const updatedNodesToSave: Node[] = [];
                const deletedNodesToSave: Node[] = [];
                const updatedNodes = new Map(prevState);
                selectedShapes.forEach((shape) => {
                    const key = shape.id();
                    const currNode = nodes.get(key);
                    if (currNode) {
                        currNode.parents.forEach((parent) => {
                            const parentNode = updatedNodes.get(parent);
                            if (parentNode) {
                                const updatedParent = {
                                    ...parentNode,
                                    children: parentNode.children.filter((child) => child.id !== currNode.id),
                                };
                                updatedNodes.set(parent, updatedParent);
                                updatedNodesToSave.push(updatedParent);
                            }
                        });
                        currNode.children.forEach((child) => {
                            const childNode = updatedNodes.get(child.id);
                            if (childNode) {
                                const updatedChild = {
                                    ...childNode,
                                    parents: childNode.parents.filter((parent) => parent !== currNode.id),
                                };
                                updatedNodes.set(child.id, updatedChild);
                                updatedNodesToSave.push(updatedChild);
                            }
                        });
                        updatedNodes.delete(currNode.id);
                        deletedNodesToSave.push(currNode);
                    }
                });
                addToHistory({
                    type: "delete",
                    diff: deletedNodesToSave.map((node) => node.id),
                    nodes: updatedNodes,
                });
                deleteBoardNodes(updatedNodesToSave, deletedNodesToSave);
                // saveDeletedNodes(updatedNodesToSave, deletedNodesToSave).catch((err) => console.log(err));
                return updatedNodes;
            });
        }
        setSelectedNode(null);
        setSelectedShapes([]);
    };

    const handleToolButtonClick = (tool: ToolButtonState) => {
        setCanDragStage(false);
        switch (tool) {
            case ToolButtonState.Select:
                setSelectState(ToolButtonState.Select);
                break;
            case ToolButtonState.Drag:
                setSelectState(ToolButtonState.Drag);
                setCanDragStage(true);
                break;
            case ToolButtonState.Shapes:
                setSelectState(ToolButtonState.Shapes);
                setIsShapesOpen(!isShapesOpen);
                break;
            case ToolButtonState.Pencil:
                setSelectState(ToolButtonState.Pencil);
                break;
            case ToolButtonState.Text:
                setSelectState(ToolButtonState.Text);
                break;
            case ToolButtonState.Note:
                setSelectState(ToolButtonState.Note);
                break;
            case ToolButtonState.Rectangle:
                setSelectState(ToolButtonState.Rectangle);
                setShapeType("Rect");
                break;
            case ToolButtonState.Ellipse:
                setSelectState(ToolButtonState.Ellipse);
                break;
            case ToolButtonState.Triangle:
                setSelectState(ToolButtonState.Triangle);
                break;
            case ToolButtonState.Pentagon:
                setSelectState(ToolButtonState.Pentagon);
                break;
            case ToolButtonState.Diamond:
                setSelectState(ToolButtonState.Diamond);
                break;
            case ToolButtonState.Hexagon:
                setSelectState(ToolButtonState.Hexagon);
                break;
            case ToolButtonState.Line:
                setSelectState(ToolButtonState.Line);
                break;
            case ToolButtonState.ArrowLine:
                setSelectState(ToolButtonState.ArrowLine);
                break;
            case ToolButtonState.ArrowLine2:
                setSelectState(ToolButtonState.ArrowLine2);
                break;
        }
    };

    return (
        <>
            {isShapesOpen && (
                <div className="absolute top-[50%] -translate-y-[50%] left-20 flex flex-col bg-white">
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
                            onClick={() => setSelectState(ToolButtonState.Rectangle)}
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
            <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
                <div className="bg-white rouned-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                    <ToolButton
                        label="Select"
                        icon={MousePointer2}
                        onClick={() => handleToolButtonClick(ToolButtonState.Select)}
                        isActive={selectState === ToolButtonState.Select}
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
                    <ToolButton label="Comment" icon={MessageSquareMore} onClick={() => {}} isActive={false} />
                </div>
                <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                    <ToolButton label="Undo" icon={Undo2Icon} onClick={() => handleUndo()} isActive={false} />
                    <ToolButton label="Redo" icon={Redo2Icon} onClick={() => handleRedo()} isActive={false} />
                    <ToolButton label="Redo" icon={Trash} onClick={handleNodeDelete} isActive={false} />
                </div>
            </div>
        </>
    );
};

export default Toolbar;
