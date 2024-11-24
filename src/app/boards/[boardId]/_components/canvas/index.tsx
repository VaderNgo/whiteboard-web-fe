"use client";
import Konva from "konva";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage, Transformer } from "react-konva";
import {
  BoardAction,
  BoardContext,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  Node,
  Path,
  PathPoint,
  ShapeType,
  Text,
} from "../../_contexts/boardContext";

import Cursor from "../cursor";
import Shape from "../shapes";
import Toolbar from "../toolbar";

import useHistory from "../../_hooks/useHistory";
import useSocket from "../../_hooks/useSocket";

import { SocketContext } from "../../_contexts/socketContext";
import SimpleEditor from "../editor/simple";
import { EditablePath } from "../path";
import { calculateEdges } from "../path/functions";
import { socket } from "@/lib/websocket";
import Participants from "../participants";
import ZoomBar from "../zoombar";
import GridLayer from "../layer/grid";
import { useLoggedInUser } from "@/lib/services/queries";
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
    setDisplayColorPicker,
    setBoardId,
    userCursors,
    boardUsers,
    setBoardUsers,
    setUserCursors,
    setBoardName,
    boardAction,
    setBoardAction,
    setLayerRef,
    selectedNode,
    paths,
    setPaths,
    setSelectedPath,
    drawingPath,
    setDrawingPath,
    isDrawingPath,
    setIsDrawingPath,
    polygonSides,
    setPresentation,
    presentation,
    isJoinedPresentation,
  } = useContext(BoardContext);
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [selectionRectCoords, setSelectionRectCoords] = useState({ x1: 0, y1: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const params = useParams<{ boardId: string }>();
  const { joinBoard, leaveBoard, addNode, addPath, updateNode, updatePath, dragWhilePresenting } =
    useSocket();
  const [resizedCanvasWidth, setResizedCanvasWidth] = useState(CANVAS_WIDTH);
  const [resizedCanvasHeight, setResizedCanvasHeight] = useState(CANVAS_HEIGHT);
  const tempShapeRef = useRef<Konva.Shape | null>(null);
  const { data: loggedUser } = useLoggedInUser();
  useEffect(() => {}, [drawingPath, nodes]);

  const createStepPathPoints = (start: PathPoint, end: { x: number; y: number }): PathPoint[] => {
    return [
      new PathPoint().setAttrs({ command: "M", x: start.x, y: start.y }),
      new PathPoint().setAttrs({ command: "L", x: end.x, y: start.y }),
      new PathPoint().setAttrs({ command: "L", x: end.x, y: end.y }),
    ];
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    setBoardId(params.boardId);
    return () => {
      setBoardId(undefined);
    };
  }, [params.boardId, setBoardId, socket]);

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

  useEffect(() => {}, [boardUsers]);

  useEffect(() => {}, [boardAction, tempShapeRef]);

  useEffect(() => {}, [nodes, paths]);

  const resizeStage = () => {
    setResizedCanvasHeight(window.innerHeight);
    setResizedCanvasWidth(window.innerWidth);
  };

  useEffect(() => {
    const updateSize = () => {
      resizeStage();
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // useEffect(() => {
  // document.addEventListener("keydown", undoByShortCutKey);
  // document.addEventListener("keydown", redoByShortCutKey);
  // return () => {
  // document.removeEventListener("keydown", undoByShortCutKey);
  // document.removeEventListener("keydown", redoByShortCutKey);
  // };
  // }, [historyIndex, history, setHistoryIndex, setNodes, undoByShortCutKey, redoByShortCutKey]);

  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef);
    }
  }, [stageRef]);

  useEffect(() => {
    if (layerRef.current) {
      setLayerRef(layerRef);
    }
  }, [layerRef]);

  useEffect(() => {
    if (selectedShapes) {
      transformerRef.current?.nodes(selectedShapes);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedShapes, selectedNode]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    if (boardAction !== BoardAction.Drag) {
      return;
    }
    console.log(presentation?.presenter?.username);
    console.log("stageConfig", stageConfig);
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

      const stageX =
        -(mousePointTo.x - (stage.getPointerPosition()?.x as number) / newScale) * newScale;
      const stageY =
        -(mousePointTo.y - (stage.getPointerPosition()?.y as number) / newScale) * newScale;

      dragWhilePresenting({
        ...stageConfig,
        stageX,
        stageY,
        stageScale: newScale,
      });
      setStageConfig((prevState) => ({
        ...prevState,
        stageScale: newScale,
        stageX,
        stageY,
      }));

      // setStageStyle((prevState) => ({
      //   ...prevState,
      //   backgroundSize: `${50 * newScale}px ${50 * newScale}px`,
      //   backgroundPosition: `${stageX}px ${stageY}px`,
      // }));
    }
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === stageRef.current && boardAction === BoardAction.Drag) {
      if (presentation && presentation.presenter && presentation.presenter.id !== loggedUser?.id) {
        console.log("can not drag");
        return;
      }
      const container = stageRef.current.container();
      if (container) container.style.cursor = "grabbing";
    }
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === stageRef.current && boardAction === BoardAction.Drag) {
      if (presentation && presentation.presenter && presentation.presenter.id !== loggedUser?.id) {
        console.log("can not drag");
        return;
      }
      setStageStyle((prevState) => ({
        ...prevState,
        backgroundPosition: `${e.target.x()}px ${e.target.y()}px`,
      }));
      const newPosition = {
        x: e.target.x(),
        y: e.target.y(),
      };

      setStageConfig((prevState) => ({
        ...prevState,
        stageX: newPosition.x,
        stageY: newPosition.y,
      }));

      if (presentation && presentation.presenter && presentation.presenter.id === loggedUser?.id) {
        dragWhilePresenting({
          stageX: newPosition.x,
          stageY: newPosition.y,
          stageScale: stageConfig.stageScale,
        });
      }
    }
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === stageRef.current && boardAction === BoardAction.Drag) {
      if (presentation && presentation.presenter && presentation.presenter.id !== loggedUser?.id) {
        console.log("can not drag");
        return;
      }
      const container = stageRef.current.container();
      if (container) container.style.cursor = "auto";
      const newPosition = {
        x: e.target.x(),
        y: e.target.y(),
      };

      setStageConfig((prevState) => ({
        ...prevState,
        stageX: newPosition.x,
        stageY: newPosition.y,
      }));

      if (presentation && presentation.presenter && presentation.presenter.id === loggedUser?.id) {
        dragWhilePresenting({
          stageX: newPosition.x,
          stageY: newPosition.y,
          stageScale: stageConfig.stageScale,
        });
      }
    }
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef.current) {
      setSelectedNode(null);
      setSelectedPath(null);
      setSelectedShapes([]);
      setDisplayColorPicker(false);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== stageRef.current || boardAction === BoardAction.Drag) {
      return;
    }
    e.evt.preventDefault();
    if (boardAction === BoardAction.Select) {
      const X1 = stageRef.current.getRelativePointerPosition()?.x;
      const Y1 = stageRef.current.getRelativePointerPosition()?.y;
      setSelectionRectCoords({
        x1: X1 as number,
        y1: Y1 as number,
      });

      selectionRectRef.current?.visible(true);
      selectionRectRef.current?.width(0);
      selectionRectRef.current?.height(0);
      selectionRectRef.current?.setAttrs({
        x: X1,
        y: Y1,
      });
    } else if (boardAction === BoardAction.DrawShape) {
      const X1 = stageRef.current.getRelativePointerPosition()?.x;
      const Y1 = stageRef.current.getRelativePointerPosition()?.y;
      let shape = null;
      switch (shapeType) {
        case "Ellipse":
          shape = new Konva.Ellipse({
            x: X1,
            y: Y1,
            radiusX: 10,
            radiusY: 10,
            fill: "transparent",
            stroke: "black",
            strokeWidth: 1,
          });
          break;
        case "Polygon":
          shape = new Konva.RegularPolygon({
            x: X1,
            y: Y1,
            sides: polygonSides,
            radius: 50,
            fill: "transparent",
            stroke: "black",
            strokeWidth: 3,
          });
          break;
        case "Note":
          shape = new Konva.Rect({
            x: X1,
            y: Y1,
            width: 200,
            height: 100,
            fill: "#FFF9B2",
          });
          break;
        case "Text":
          shape = new Konva.Rect({
            x: X1,
            y: Y1,
            width: 50,
            height: 50,
            stroke: "black",
            dash: [10, 5],
          });
          break;
        default:
          shape = new Konva.Rect({
            x: X1,
            y: Y1,
            width: 50,
            height: 50,
            fill: "transparent",
            stroke: "black",
            strokeWidth: 3,
          });
          break;
      }
      tempShapeRef.current = shape;
      layerRef.current?.add(shape).batchDraw();
    } else {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (!clickedOnEmpty || isDrawingPath) return;
      const X1 = stageRef.current.getRelativePointerPosition()?.x;
      const Y1 = stageRef.current.getRelativePointerPosition()?.y;
      if (!X1 || !Y1) return;
      const initialPoint = new PathPoint().setAttrs({
        command: "M",
        x: X1,
        y: Y1,
      });

      setDrawingPath(
        new Path().setAttrs({
          points: [initialPoint],
        })
      );
      setIsDrawingPath(true);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // user mouse
    // const uid = authState.user?.uid;
    // if (uid) {
    const mouseX = stageRef.current?.getRelativePointerPosition()?.x;
    const mouseY = stageRef.current?.getRelativePointerPosition()?.y;
    if (mouseX && mouseY) {
      // updateUserMouse({ x: mouseX, y: mouseY });
    }
    // }

    e.evt.preventDefault();
    if (boardAction === BoardAction.Select) {
      if (!selectionRectRef.current?.visible()) {
        selectionRectRef.current?.visible(false);
        return;
      }
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
    }
    if (boardAction === BoardAction.DrawShape) {
      if (tempShapeRef.current && mouseX && mouseY) {
        const { x: shapeX, y: shapeY } = tempShapeRef.current!.attrs;
        switch (shapeType) {
          case "Rect":
          case "Note":
          case "Text":
            tempShapeRef.current.setAttrs({
              width: mouseX! - shapeX!,
              height: mouseY! - shapeY!,
            });
            break;
          case "Ellipse":
            const radiusX = Math.abs(mouseX! - shapeX!);
            const radiusY = Math.abs(mouseY! - shapeY!);
            const radius = Math.max(radiusX, radiusY);
            tempShapeRef.current.setAttrs({
              radiusX: radius,
              radiusY: radius,
              strokeScaleEnabled: false,
            });
            break;
          case "Polygon":
            const widthT = Math.abs(mouseX! - shapeX!);
            const heightT = Math.abs(mouseY! - shapeY!);
            const radiusT = Math.min(widthT, heightT) / 2;
            const scaleX = widthT / radiusT;
            const scaleY = heightT / radiusT;
            tempShapeRef.current.setAttrs({
              radius: radiusT,
              scaleX,
              scaleY,
              strokeScaleEnabled: false,
            });
            break;
        }
        layerRef.current?.batchDraw();
      }
    } else {
      if (!isDrawingPath || !drawingPath) return;
      const x2 = stageRef.current?.getRelativePointerPosition()?.x;
      const y2 = stageRef.current?.getRelativePointerPosition()?.y;
      if (!x2 || !y2) return;
      const startPoint = drawingPath.points[0];
      const newPoints = createStepPathPoints(startPoint, { x: x2, y: y2 });

      setDrawingPath(
        new Path().setAttrs({
          ...drawingPath,
          points: newPoints,
        })
      );
    }
  };

  const addDrawnShape = () => {
    if (!tempShapeRef.current) return;
    let shapeAttribute;
    switch (shapeType) {
      case "Ellipse":
        shapeAttribute = {
          x: tempShapeRef.current?.attrs.x,
          y: tempShapeRef.current?.attrs.y,
          width: tempShapeRef.current?.attrs.radiusX * 2,
          height: tempShapeRef.current?.attrs.radiusY * 2,
          shapeType: "Ellipse" as ShapeType,
        };
        break;
      case "Polygon":
        shapeAttribute = {
          x: tempShapeRef.current?.attrs.x,
          y: tempShapeRef.current?.attrs.y,
          width: tempShapeRef.current?.attrs.radius * tempShapeRef.current?.attrs.scaleX,
          height: tempShapeRef.current?.attrs.radius * tempShapeRef.current?.attrs.scaleY,
          sides: polygonSides,
          shapeType: "Polygon" as ShapeType,
        };
        break;
      case "Note":
        shapeAttribute = {
          x: tempShapeRef.current?.attrs.x,
          y: tempShapeRef.current?.attrs.y,
          width: tempShapeRef.current?.attrs.width,
          height: tempShapeRef.current?.attrs.height,
          fillColor: tempShapeRef.current?.attrs.fill,
          shapeType: "Note" as ShapeType,
        };
        break;
      case "Text":
        shapeAttribute = {
          x: tempShapeRef.current?.attrs.x,
          y: tempShapeRef.current?.attrs.y,
          width: tempShapeRef.current?.attrs.width,
          height: tempShapeRef.current?.attrs.height,
          text: new Text().setAttrs({ content: "Place your text here !" }),
          shapeType: "Text" as ShapeType,
        };
        break;
      default:
        shapeAttribute = {
          x: tempShapeRef.current?.attrs.x + tempShapeRef.current?.attrs.width / 2,
          y: tempShapeRef.current?.attrs.y + tempShapeRef.current?.attrs.height / 2,
          width: tempShapeRef.current?.attrs.width,
          height: tempShapeRef.current?.attrs.height,
        };
        break;
    }
    const newNode: Node = new Node().setAttrs({
      ...shapeAttribute,
    });
    setNodes((prevState) => {
      prevState.set(newNode.id, newNode);
      return new Map(prevState);
    });
    addNode(newNode);
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    setIsDrawingPath(false);
    if (boardAction === BoardAction.Select) {
      if (!selectionRectRef.current?.visible()) {
        selectionRectRef.current?.visible(false);
        return;
      }
      setTimeout(() => {
        selectionRectRef.current?.visible(false);
      });
      const shapes = stageRef.current?.find(".mindmap-node");
      const box = selectionRectRef.current?.getClientRect();
      const selected = shapes?.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      setSelectedShapes(selected as Konva.Group[]);
    } else if (boardAction === BoardAction.DrawShape) {
      addDrawnShape();
      tempShapeRef.current?.destroy();
      layerRef.current?.batchDraw();
      tempShapeRef.current = null;
      setBoardAction(BoardAction.Select);
    } else {
      if (!isDrawingPath || !drawingPath) return;

      const finalPath = calculateEdges(drawingPath);
      setPaths((prevPaths) => {
        const newPaths = new Map(prevPaths);
        newPaths.set(finalPath.id, finalPath);
        return newPaths;
      });
      addPath(finalPath);
      setDrawingPath(null);
      setIsDrawingPath(false);
      setBoardAction(BoardAction.Select);
    }
  };

  return (
    <>
      <SimpleEditor />
      <Toolbar />
      <BoardContext.Consumer>
        {(roomContextValue) => (
          <SocketContext.Consumer>
            {(socketContextValue) => (
              <Stage
                onContextMenu={(e) => e.evt.preventDefault()}
                // style={stageStyle}
                style={{ opacity: 0.8, backgroundColor: "#e2e8f0" }}
                ref={stageRef}
                className=" absolute top-0 overflow-hidden"
                scaleX={
                  isJoinedPresentation &&
                  presentation?.presentation &&
                  presentation.presenter?.id !== loggedUser?.id
                    ? presentation.presentation.stageScale
                    : stageConfig.stageScale
                }
                scaleY={
                  isJoinedPresentation &&
                  presentation?.presentation &&
                  presentation.presenter?.id !== loggedUser?.id
                    ? presentation.presentation.stageScale
                    : stageConfig.stageScale
                }
                x={
                  isJoinedPresentation && presentation?.presentation
                    ? presentation.presentation.stageX
                    : stageConfig.stageX
                }
                y={
                  isJoinedPresentation && presentation?.presentation
                    ? presentation.presentation.stageY
                    : stageConfig.stageY
                }
                width={resizedCanvasWidth}
                height={resizedCanvasHeight}
                draggable={boardAction === BoardAction.Drag}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onClick={handleClick}
                onTap={handleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
              >
                <BoardContext.Provider value={roomContextValue}>
                  <SocketContext.Provider value={socketContextValue}>
                    <GridLayer />
                    <Layer ref={layerRef}>
                      {true && (
                        <>
                          {Array.from(paths.values()).map((path) => {
                            if (path.deleted) return null;
                            return (
                              <EditablePath
                                key={path.id}
                                initialPath={path}
                                onChange={(updatedPath) => {
                                  const newPaths = new Map(paths);
                                  newPaths.set(updatedPath.id, updatedPath);
                                  setPaths(newPaths);
                                  updatePath(updatedPath.id, updatedPath);
                                }}
                              />
                            );
                          })}
                          {drawingPath && (
                            <Line
                              points={drawingPath.points.flatMap((p) => [p.x, p.y])}
                              stroke={drawingPath.strokeColor}
                              strokeWidth={drawingPath.strokeWidth}
                              dash={drawingPath.dash}
                            />
                          )}
                          {nodes &&
                            nodes.size > 0 &&
                            Array.from(nodes.keys()).map((key) => {
                              const currNode = nodes.get(key);
                              if (!currNode || currNode.deleted) return null;
                              return <Shape key={key} node={currNode} />;
                            })}
                          {selectedShapes && (
                            <Transformer
                              ref={transformerRef}
                              rotateEnabled={true}
                              anchorSize={15}
                              anchorStrokeWidth={5}
                              anchorCornerRadius={50}
                              flipEnabled={true}
                              ignoreStroke={true}
                              boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 5 || newBox.height < 5) {
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
                                    // <Cursor
                                    //   key={key}
                                    //   x={currUserCursor.x}
                                    //   y={currUserCursor.y}
                                    //   // color={currUser.color}
                                    //   // name={currUser.name}
                                    // />
                                    <></>
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
      <Participants />
      <ZoomBar />
    </>
  );
};

export default Canvas;
