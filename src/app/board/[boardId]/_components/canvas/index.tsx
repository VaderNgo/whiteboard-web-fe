"use client";
import { ContentState, convertToRaw } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { BoardContext, CANVAS_HEIGHT, CANVAS_WIDTH, Node } from "../../_contexts/boardContext";

import Cursor from "../cursor";
import Edge from "../edge";
import Shape from "../shapes";
import Toolbar from "../toolbar";

import useHistory from "../../_hooks/useHistory";
import useSocket from "../../_hooks/useSocket";

import { SocketContext } from "../../_contexts/socketContext";

const Canvas: React.FC = () => {
    const {
        nodes,
        setNodes,
        selectedShapes,
        setSelectedShapes,
        setSelectedNode,
        stageConfig,
        setStageConfig,
        stageStyle,
        setStageStyle,
        shapeType,
        setStageRef,
        fillStyle,
        strokeStyle,
        setDisplayColorPicker,
        history,
        historyIndex,
        setHistoryIndex,
        setBoardId,
        boardId,
        userCursors,
        boardUsers,
        setBoardUsers,
        setUserCursors,
        setBoardName,
        canDragStage,
        setCanDragStage,
    } = useContext(BoardContext);
    const transformerRef = useRef<Konva.Transformer>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);
    const [selectionRectCoords, setSelectionRectCoords] = useState({ x1: 0, y1: 0 });
    const stageRef = useRef<Konva.Stage>(null);
    const { addToHistory, undoByShortCutKey, redoByShortCutKey } = useHistory();
    const params = useParams<{ boardId: string }>();
    // const { getRoom, isLoading } = useGetRoom();
    // const { saveUpdatedNodes } = useSaveRoom();
    const { joinBoard, leaveBoard, updateBoard, updateUserMouse } = useSocket();
    const [resizedCanvasWidth, setResizedCanvasWidth] = useState(CANVAS_WIDTH);
    const [resizedCanvasHeight, setResizedCanvasHeight] = useState(CANVAS_HEIGHT);

    useEffect(() => {
        // setNodes(new Map());
        setBoardId(params.boardId);
        return () => {
            setBoardId(undefined);
        };
    }, [params.boardId, setBoardId]);

    useEffect(() => {
        if (params.boardId) {
            joinBoard();
        }
        return () => {
            leaveBoard();
            setBoardUsers(new Map());
            setUserCursors(new Map());
            setBoardName("");
        };
    }, [params.boardId, joinBoard, leaveBoard, setBoardUsers, setUserCursors, setBoardName]); //getBoard

    const resizeStage = () => {
        setResizedCanvasHeight(window.innerHeight);
        setResizedCanvasWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", resizeStage);
        return () => {
            window.removeEventListener("resize", resizeStage);
        };
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", undoByShortCutKey);
        document.addEventListener("keydown", redoByShortCutKey);
        return () => {
            document.removeEventListener("keydown", undoByShortCutKey);
            document.removeEventListener("keydown", redoByShortCutKey);
        };
    }, [historyIndex, history, setHistoryIndex, setNodes, undoByShortCutKey, redoByShortCutKey]);

    useEffect(() => {
        if (stageRef.current) {
            setStageRef(stageRef);
        }
    }, [setStageRef]);

    useEffect(() => {
        if (selectedShapes) {
            transformerRef.current?.nodes(selectedShapes);
            transformerRef.current?.getLayer()?.batchDraw();
        }
    }, [selectedShapes, nodes]);

    const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        let pointerPosition = null;
        if (e.target === stageRef.current && stage) {
            pointerPosition = stage.getRelativePointerPosition();
            if (pointerPosition) {
                const id = nanoid();
                const defaultBlockArray = htmlToDraft(`<p style="font-size: 18px;"></p>`);
                const contentState = ContentState.createFromBlockArray(
                    defaultBlockArray.contentBlocks,
                    defaultBlockArray.entityMap
                );
                const newNode: Node = {
                    id,
                    children: [],
                    parents: [],
                    text: JSON.stringify(convertToRaw(contentState)),
                    shapeType,
                    x: pointerPosition.x,
                    y: pointerPosition.y,
                    width: 380,
                    height: 90,
                    fillStyle,
                    strokeStyle,
                };
                setNodes((prevState) => {
                    prevState.set(newNode.id, newNode);
                    addToHistory({
                        type: "add",
                        diff: [newNode.id],
                        nodes: prevState,
                    });
                    return new Map(prevState);
                });
                // saveUpdatedNodes([newNode]).catch((err) => console.log(err));
                updateBoard([newNode], "update");
            }
        }
    };

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        if (!canDragStage) {
            return;
        }
        if (stageRef.current) {
            const stage = stageRef.current;
            const scaleBy = 1.05;
            const oldScale = stageRef.current.scaleX();
            const mousePointTo = {
                x: (stage.getPointerPosition()?.x as number) / oldScale - stage.x() / oldScale,
                y: (stage.getPointerPosition()?.y as number) / oldScale - stage.y() / oldScale,
            };

            const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

            if (newScale > 2 || newScale < 0.1) {
                return;
            }

            const stageX = -(mousePointTo.x - (stage.getPointerPosition()?.x as number) / newScale) * newScale;
            const stageY = -(mousePointTo.y - (stage.getPointerPosition()?.y as number) / newScale) * newScale;

            setStageConfig((prevState) => ({
                ...prevState,
                stageScale: newScale,
                stageX,
                stageY,
            }));

            setStageStyle((prevState) => ({
                ...prevState,
                backgroundSize: `${50 * newScale}px ${50 * newScale}px`,
                backgroundPosition: `${stageX}px ${stageY}px`,
            }));
        }
    };

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (e.target === stageRef.current && canDragStage) {
            const container = stageRef.current.container();
            if (container) container.style.cursor = "grabbing";
        }
    };

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (e.target === stageRef.current && canDragStage) {
            setStageStyle((prevState) => ({
                ...prevState,
                backgroundPosition: `${e.target.x()}px ${e.target.y()}px`,
            }));
        }
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (e.target === stageRef.current && canDragStage) {
            const container = stageRef.current.container();
            if (container) container.style.cursor = "auto";
        }
    };

    const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === stageRef.current) {
            setSelectedNode(null);
            setSelectedShapes([]);
            setDisplayColorPicker(false);
        }
    };

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target !== stageRef.current || canDragStage) {
            return;
        }
        e.evt.preventDefault();
        const X1 = stageRef.current.getRelativePointerPosition()?.x;
        const X2 = stageRef.current.getRelativePointerPosition()?.y;
        setSelectionRectCoords({
            x1: X1 as number,
            y1: X2 as number,
        });

        selectionRectRef.current?.visible(true);
        selectionRectRef.current?.width(0);
        selectionRectRef.current?.height(0);
        selectionRectRef.current?.setAttrs({
            x: X1,
            y: X2,
        });
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // user mouse
        // const uid = authState.user?.uid;
        // if (uid) {
        const mouseX = stageRef.current?.getRelativePointerPosition()?.x;
        const mouseY = stageRef.current?.getRelativePointerPosition()?.y;
        if (mouseX && mouseY) {
            updateUserMouse({ x: mouseX, y: mouseY });
        }
        // }

        if (!selectionRectRef.current?.visible() || canDragStage) {
            selectionRectRef.current?.visible(false);
            return;
        }
        e.evt.preventDefault();
        const x2 = stageRef.current?.getRelativePointerPosition()?.x;
        const y2 = stageRef.current?.getRelativePointerPosition()?.y;
        if (selectionRectCoords && x2 && y2) {
            selectionRectRef.current.setAttrs({
                x: Math.min(selectionRectCoords.x1, x2),
                y: Math.min(selectionRectCoords.y1, y2),
                width: Math.abs(x2 - selectionRectCoords.x1),
                height: Math.abs(y2 - selectionRectCoords.y1),
            });
        }
    };

    const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!selectionRectRef.current?.visible() || canDragStage) {
            selectionRectRef.current?.visible(false);
            return;
        }
        e.evt.preventDefault();
        setTimeout(() => {
            selectionRectRef.current?.visible(false);
        });
        const shapes = stageRef.current?.find(".mindmap-node");
        const box = selectionRectRef.current?.getClientRect();
        const selected = shapes?.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
        setSelectedShapes(selected as Konva.Group[]);
    };

    return (
        <>
            <Toolbar />
            <BoardContext.Consumer>
                {(roomContextValue) => (
                    <SocketContext.Consumer>
                        {(socketContextValue) => (
                            <Stage
                                onContextMenu={(e) => e.evt.preventDefault()}
                                style={stageStyle}
                                ref={stageRef}
                                className="-z-10 absolute top-0 overflow-hidden"
                                scaleX={stageConfig.stageScale}
                                scaleY={stageConfig.stageScale}
                                x={stageConfig.stageX}
                                y={stageConfig.stageY}
                                width={resizedCanvasWidth}
                                height={resizedCanvasHeight}
                                draggable={canDragStage}
                                onDragStart={handleDragStart}
                                onDragMove={handleDragMove}
                                onDragEnd={handleDragEnd}
                                onClick={handleClick}
                                onTap={handleClick}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onDblClick={handleDoubleClick}
                                onWheel={handleWheel}
                            >
                                <BoardContext.Provider value={roomContextValue}>
                                    <SocketContext.Provider value={socketContextValue}>
                                        <Layer>
                                            {true && (
                                                <>
                                                    {nodes &&
                                                        nodes.size > 0 &&
                                                        Array.from(nodes.keys()).map((key) => {
                                                            const currNode = nodes.get(key);
                                                            if (!currNode) return null;
                                                            return currNode.children.map((child) => {
                                                                const currChild = nodes.get(child.id);
                                                                if (!currChild) return null;
                                                                return (
                                                                    <Edge
                                                                        key={`edge_${currNode.id}_${child.id}`}
                                                                        node={currNode}
                                                                        currNodeChildren={currChild}
                                                                        color={child.color}
                                                                    />
                                                                );
                                                            });
                                                        })}
                                                    {nodes &&
                                                        nodes.size > 0 &&
                                                        Array.from(nodes.keys()).map((key) => {
                                                            const currNode = nodes.get(key);
                                                            if (!currNode) return null;
                                                            return <Shape key={key} node={currNode} />;
                                                        })}
                                                    {selectedShapes && (
                                                        <Transformer
                                                            ref={transformerRef}
                                                            rotateEnabled={false}
                                                            anchorSize={15}
                                                            anchorStrokeWidth={3}
                                                            anchorCornerRadius={100}
                                                            flipEnabled={false}
                                                            boundBoxFunc={(oldBox, newBox) => {
                                                                if (newBox.width > 800) {
                                                                    return oldBox;
                                                                }
                                                                return newBox;
                                                            }}
                                                        />
                                                    )}
                                                    <Rect
                                                        ref={selectionRectRef}
                                                        fill="rgba(99,102,241,0.2)"
                                                        visible={false}
                                                    />
                                                    {userCursors && (
                                                        <>
                                                            {boardUsers &&
                                                                boardUsers.size > 0 &&
                                                                Array.from(boardUsers.keys()).map((key) => {
                                                                    const currUserCursor = userCursors.get(key);
                                                                    const currUser = boardUsers.get(key);
                                                                    if (!currUserCursor || !currUser) return null;
                                                                    return (
                                                                        <Cursor
                                                                            key={key}
                                                                            x={currUserCursor.x}
                                                                            y={currUserCursor.y}
                                                                            color={currUser.color}
                                                                            name={currUser.name}
                                                                        />
                                                                    );
                                                                })}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Layer>
                                    </SocketContext.Provider>
                                </BoardContext.Provider>
                            </Stage>
                        )}
                    </SocketContext.Consumer>
                )}
            </BoardContext.Consumer>
        </>
    );
};

export default Canvas;
