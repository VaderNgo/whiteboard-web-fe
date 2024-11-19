"use client";

import { LoggedInUser, PathModel, ShapeModel } from "@/lib/services/queries";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { nanoid } from "nanoid";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { PresentationsPayload } from "./socketContext";

export const fills = [
  "#6B7280",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export type ShapeType = "Rect" | "Ellipse" | "Polygon" | "Note" | "Text";

export enum EditorTab {
  SHAPE_PICKER = "shape_picker",
  SHAPE_BORDER = "shape_border",
  SHAPE_COLOR = "shape_color",

  FONT_SIZE = "font_size",
  FONT_FAMILY = "font_family",
  FONT_STYLE = "font_style",

  TEXT_COLOR = "font_color",
  TEXT_HIGHLIGHT = "font_highlight",

  ALIGNMENT = "alignment",
}

type BoardContextProps = {
  children: React.ReactNode;
  pathsProp: PathModel[];
  shapesProp: ShapeModel[];
  presentationProp: PresentationsPayload | null;
};

export type Children = {
  id: string;
  color: string;
};

export enum BoardAction {
  Select = "Select",
  Drag = "Drag",
  DrawShape = "DrawShape",
  DrawLine = "DrawLine",
  DragPath = "DragPath",
}

export class Text {
  id: string = nanoid();
  content: string = "";
  fontSize: number = 12;
  fontFamily: string = "Arial";
  fontStyle: string = "normal"; // normal, bold, italic , italic bold
  align: string = "left";
  verticalAlign: string = "top";
  textColor: string = "black";
  hightlightColor: string = "transparent";

  setAttrs(obj: Partial<Text>): Text {
    Object.assign(this, obj);
    return this;
  }
}

export class AnchorPoint {
  nodeId: string = "";
  indexAnchor: number = 0;
  position: Vector2d = { x: 0, y: 0 };
  setAttrs(obj: Partial<AnchorPoint>): AnchorPoint {
    Object.assign(this, obj);
    return this;
  }
}

export class Node {
  id: string = nanoid();
  children: Children[] = [];
  parents: string[] = [];
  text: Text = new Text();
  shapeType: ShapeType = "Rect";
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  fillColor: string = "transparent";
  strokeColor: string = "black";
  strokeWidth: number = 2;
  sides: number = 3;
  anchorPoints: AnchorPoint[] = [];

  deleted: boolean = false;
  setAttrs(obj: Partial<Node>): Node {
    Object.assign(this, obj);
    this.calculateAnchorPoints();
    return this;
  }
  public calculateAnchorPoints() {
    this.anchorPoints = [];
    if (this.shapeType === "Rect") {
      this.anchorPoints = [
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 0,
          position: { x: 0, y: this.height / 2 },
        }),
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 1,
          position: { x: this.width / 2, y: 0 },
        }),
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 2,
          position: { x: this.width / 2, y: this.height },
        }),
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 3,
          position: { x: this.width, y: this.height / 2 },
        }),
      ];
    } else if (this.shapeType === "Ellipse") {
      this.anchorPoints = [
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 0,
          position: { x: 0, y: this.height / 2 },
        }),
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 1,
          position: { x: this.width / 2, y: 0 },
        }),
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 2,
          position: { x: -this.width / 2, y: 0 },
        }),
        new AnchorPoint().setAttrs({
          nodeId: this.id,
          indexAnchor: 3,
          position: { x: 0, y: -this.height / 2 },
        }),
      ];
    } else if (this.shapeType === "Polygon") {
      if (this.sides == 3) {
        this.anchorPoints = [
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 0,
            position: { x: 0, y: this.height / 2 },
          }),
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 1,
            position: { x: this.width / Math.sqrt(3), y: 0 },
          }),
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 2,
            position: { x: -this.width / Math.sqrt(3), y: 0 },
          }),
        ];
      } else if (this.sides >= 4) {
        this.anchorPoints = [
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 0,
            position: { x: 0, y: this.height },
          }),
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 1,
            position: { x: this.width, y: 0 },
          }),
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 2,
            position: { x: -this.width, y: 0 },
          }),
          new AnchorPoint().setAttrs({
            nodeId: this.id,
            indexAnchor: 3,
            position: { x: 0, y: -this.height },
          }),
        ];
      }
    }
  }
}

export class PathPoint {
  command: string = "M";
  x: number = 0;
  y: number = 0;
  setAttrs(obj: Partial<PathPoint>): PathPoint {
    Object.assign(this, obj);
    return this;
  }
}

export class PathEdge {
  axis: string = "x";
  points: number[] = [];

  setAttrs(obj: Partial<PathEdge>): PathEdge {
    Object.assign(this, obj);
    return this;
  }
}

export class Path {
  id: string = nanoid();
  dragging: null | string = null;
  activeDrag: { extruded: boolean } = { extruded: false };
  edges: PathEdge[] = [];
  extrudableEdges: PathEdge[] = [];
  points: PathPoint[] = [];
  strokeColor: string = "black";
  strokeWidth: number = 2;
  dash: [number, number] = [5, 5];

  startAnchorPoint: { nodeId: string; indexAnchor: number } | null = null;
  endAnchorPoint: { nodeId: string; indexAnchor: number } | null = null;

  deleted: boolean = false;

  setAttrs(obj: Partial<Path>): Path {
    Object.assign(this, obj);
    return this;
  }
}

export type StageConfig = {
  stageScale: number;
  stageX: number;
  stageY: number;
};

type StageStyle = {
  backgroundColor: string;
  opacity: number;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
};

export type EditorType = {
  node: Node | null;
  text: Text | null;
};

export type History = {
  action: "add" | "delete" | "update";
  type: "node" | "path";
  nodeData?: Node;
  pathData?: Path;
};

export type UserCursor = {
  x: number;
  y: number;
};

export type BoardUser = {
  name: string | null;
  avatarUrl: string | null;
  color: string;
  role: string | null;
};

type IBoardContext = {
  nodes: Map<string, Node>;
  setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  paths: Map<string, Path>;
  setPaths: React.Dispatch<React.SetStateAction<Map<string, Path>>>;
  selectedPath: Path | null;
  setSelectedPath: React.Dispatch<React.SetStateAction<Path | null>>;
  drawingPath: Path | null;
  setDrawingPath: React.Dispatch<React.SetStateAction<Path | null>>;
  isDrawingPath: boolean;
  setIsDrawingPath: React.Dispatch<React.SetStateAction<boolean>>;
  editorValue: EditorType;
  setEditorValue: React.Dispatch<React.SetStateAction<EditorType>>;
  boardAction: BoardAction;
  setBoardAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  canDragStage: boolean;
  setCanDragStage: React.Dispatch<React.SetStateAction<boolean>>;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
  polygonSides: number;
  setPolygonSides: React.Dispatch<React.SetStateAction<number>>;
  fillStyle: string;
  setFillStyle: React.Dispatch<React.SetStateAction<string>>;
  strokeStyle: string;
  setStrokeStyle: React.Dispatch<React.SetStateAction<string>>;
  lineStyle: string;
  setLineStyle: React.Dispatch<React.SetStateAction<string>>;
  selectedShapes: Konva.Group[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<Konva.Group[]>>;
  stageConfig: StageConfig;
  setStageConfig: React.Dispatch<React.SetStateAction<StageConfig>>;
  stageStyle: StageStyle;
  setStageStyle: React.Dispatch<React.SetStateAction<StageStyle>>;
  stageRef: React.RefObject<Konva.Stage> | null;
  setStageRef: React.Dispatch<React.SetStateAction<React.RefObject<Konva.Stage> | null>>;
  layerRef: React.RefObject<Konva.Layer> | null;
  setLayerRef: React.Dispatch<React.SetStateAction<React.RefObject<Konva.Layer> | null>>;
  displayColorPicker: boolean;
  setDisplayColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  undoStack: History[];
  setUndoStack: React.Dispatch<React.SetStateAction<History[]>>;
  redoStack: History[];
  setRedoStack: React.Dispatch<React.SetStateAction<History[]>>;
  boardId: string | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | undefined>>;
  userCursors: Map<string, UserCursor>;
  setUserCursors: React.Dispatch<React.SetStateAction<Map<string, UserCursor>>>;
  boardUsers: Map<string, LoggedInUser>;
  setBoardUsers: React.Dispatch<React.SetStateAction<Map<string, LoggedInUser>>>;
  boardName: string;
  setBoardName: React.Dispatch<React.SetStateAction<string>>;
  presentation: PresentationsPayload | null;
  setPresentation: React.Dispatch<React.SetStateAction<PresentationsPayload | null>>;
  isJoinedPresentation: boolean;
  setIsJoinedPresentation: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BoardContext: React.Context<IBoardContext> = createContext({} as IBoardContext);

export const BoardContextProvider: React.FC<BoardContextProps> = ({
  children,
  shapesProp,
  pathsProp,
  presentationProp,
}) => {
  const [stageRef, setStageRef] = useState<React.RefObject<Konva.Stage> | null>(null);
  const [layerRef, setLayerRef] = useState<React.RefObject<Konva.Layer> | null>(null);
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map());
  const [paths, setPaths] = useState<Map<string, Path>>(new Map());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [drawingPath, setDrawingPath] = useState<Path | null>(null);
  const [isDrawingPath, setIsDrawingPath] = useState<boolean>(false);
  const [shapeType, setShapeType] = useState<ShapeType>("Rect");
  const [polygonSides, setPolygonSides] = useState<number>(3);
  const [fillStyle, setFillStyle] = useState<string>("#fff");
  const [strokeStyle, setStrokeStyle] = useState<string>("#000");
  const [lineStyle, setLineStyle] = useState<string>("#000");
  const [selectedShapes, setSelectedShapes] = useState<Konva.Group[]>([]);
  const [stageConfig, setStageConfig] = useState<StageConfig>({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });
  const [presentation, setPresentation] = useState<PresentationsPayload | null>(null);
  const [isJoinedPresentation, setIsJoinedPresentation] = useState<boolean>(false);
  const [stageStyle, setStageStyle] = useState<StageStyle>({
    backgroundColor: "#e2e8f0",
    opacity: 0.8,
    backgroundImage: "radial-gradient(#6b7280 1.1px, #e2e8f0 1.1px)",
    backgroundSize: `${50 * stageConfig.stageScale}px ${50 * stageConfig.stageScale}px`,
    backgroundPosition: "0px 0px",
  });
  const [canDragStage, setCanDragStage] = useState<boolean>(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [dark, setDark] = useState(false);
  const [boardId, setBoardId] = useState<string | undefined>();
  const [boardName, setBoardName] = useState<string>("");
  const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map());
  const [boardUsers, setBoardUsers] = useState<Map<string, LoggedInUser>>(new Map());
  const [boardAction, setBoardAction] = useState<BoardAction>(BoardAction.Select);
  const [editorValue, setEditorValue] = useState<EditorType>({
    node: null,
    text: null,
  });
  const [undoStack, setUndoStack] = useState<History[]>([]);
  const [redoStack, setRedoStack] = useState<History[]>([]);

  useEffect(() => {
    // Initialize nodes from shapesProp
    const initialNodes = new Map<string, Node>();
    shapesProp.forEach((s) => {
      const text = new Text().setAttrs(s.data.text);
      const anchorPoints = s.data.anchorPoints.map((ap) => new AnchorPoint().setAttrs(ap));
      const newNode = new Node().setAttrs({ ...s.data, text, anchorPoints });
      newNode.calculateAnchorPoints();
      initialNodes.set(newNode.id, newNode);
    });
    setNodes(initialNodes);

    // Initialize paths from pathsProp
    const initialPaths = new Map<string, Path>();
    pathsProp.forEach((p) => {
      const edges = p.data.edges.map((e) => new PathEdge().setAttrs(e));
      const extrudableEdges = p.data.extrudableEdges.map((e) => new PathEdge().setAttrs(e));
      const points = p.data.points.map((p) => new PathPoint().setAttrs(p));
      const newPath = new Path().setAttrs({ ...p.data, edges, extrudableEdges, points });
      initialPaths.set(newPath.id, newPath);
    });
    setPaths(initialPaths);
  }, [shapesProp, pathsProp]);

  useEffect(() => {
    if (presentationProp) {
      setPresentation(presentationProp);
    }
  }, [presentationProp]);
  const value = useMemo(
    () => ({
      stageRef,
      setStageRef,
      nodes,
      setNodes,
      selectedNode,
      setSelectedNode,
      paths,
      setPaths,
      selectedPath,
      setSelectedPath,
      drawingPath,
      setDrawingPath,
      isDrawingPath,
      setIsDrawingPath,
      shapeType,
      setShapeType,
      polygonSides,
      setPolygonSides,
      fillStyle,
      setFillStyle,
      strokeStyle,
      setStrokeStyle,
      lineStyle,
      setLineStyle,
      selectedShapes,
      setSelectedShapes,
      stageConfig,
      setStageConfig,
      stageStyle,
      setStageStyle,
      displayColorPicker,
      setDisplayColorPicker,
      dark,
      setDark,
      boardId,
      setBoardId,
      userCursors,
      setUserCursors,
      boardUsers,
      setBoardUsers,
      boardName,
      setBoardName,
      canDragStage,
      setCanDragStage,
      boardAction,
      setBoardAction,
      layerRef,
      setLayerRef,
      editorValue,
      setEditorValue,
      undoStack,
      setUndoStack,
      redoStack,
      setRedoStack,
      presentation,
      setPresentation,
      isJoinedPresentation,
      setIsJoinedPresentation,
    }),
    [
      presentation,
      isJoinedPresentation,
      nodes,
      paths,
      selectedNode,
      selectedPath,
      drawingPath,
      isDrawingPath,
      selectedShapes,
      stageConfig,
      stageStyle,
      shapeType,
      polygonSides,
      fillStyle,
      strokeStyle,
      lineStyle,
      displayColorPicker,
      dark,
      stageRef,
      boardId,
      boardUsers,
      userCursors,
      boardName,
      canDragStage,
      boardAction,
      layerRef,
      editorValue,
      undoStack,
      redoStack,
    ]
  );

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
