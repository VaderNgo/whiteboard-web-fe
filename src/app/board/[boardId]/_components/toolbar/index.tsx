import {
    Circle,
    MessageSquareMore,
    MousePointer2,
    MoveUpRightIcon,
    PencilIcon,
    Redo2Icon,
    Square,
    StickyNoteIcon,
    Trash,
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

const Toolbar = () => {
    const { nodes, setNodes, history, historyIndex, selectedNode, selectedShapes, setSelectedNode, setSelectedShapes } =
        useContext(BoardContext);
    const { addToHistory, handleRedo, handleUndo } = useHistory();
    const { deleteBoardNodes } = useSocket();

    enum ToolButtonState {
        Select = "select",
        Text = "text",
        Note = "note",
        Rectangle = "rectangle",
        Ellipse = "ellipse",
        Pencil = "pencil",
        Connection = "connection",
    }
    const [selectState, setSelectState] = useState<ToolButtonState>(ToolButtonState.Select);

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

    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rouned-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    onClick={() => setSelectState(ToolButtonState.Select)}
                    isActive={selectState === ToolButtonState.Select}
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
                    label="Rectangle"
                    icon={Square}
                    onClick={() => setSelectState(ToolButtonState.Rectangle)}
                    isActive={selectState === ToolButtonState.Rectangle}
                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    onClick={() => setSelectState(ToolButtonState.Ellipse)}
                    isActive={selectState === ToolButtonState.Ellipse}
                />
                <ToolButton
                    label="Pen"
                    icon={PencilIcon}
                    onClick={() => setSelectState(ToolButtonState.Pencil)}
                    isActive={selectState === ToolButtonState.Pencil}
                />
                <ToolButton label="Connection Line" icon={MoveUpRightIcon} onClick={() => {}} isActive={false} />
                <ToolButton label="Comment" icon={MessageSquareMore} onClick={() => {}} isActive={false} />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                <ToolButton label="Undo" icon={Undo2Icon} onClick={() => handleUndo()} isActive={false} />
                <ToolButton label="Redo" icon={Redo2Icon} onClick={() => handleRedo()} isActive={false} />
                <ToolButton label="Redo" icon={Trash} onClick={handleNodeDelete} isActive={false} />
            </div>
        </div>
    );
};

export default Toolbar;
