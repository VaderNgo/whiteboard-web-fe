"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Konva from "konva";

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

export type ShapeType = "Rect" | "Ellipse" | "Polygon" | "Line";

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
};

export type Children = {
  id: string;
  color: string;
};

export enum BoardAction {
  Select = "Select",
  Drag = "Drag",
  Draw = "Draw",
}

export class Text {
  id: string = "";
  content: string = "ABC";
  fontSize: number = 12;
  fontFamily: string = "Arial";
  align: string = "left";
  verticalAlign: string = "top";
  textColor: string = "black";
  hightlightColor: string = "transparent";

  setAttrs(obj: Partial<Text>): Text {
    Object.assign(this, obj);
    return this;
  }
}

export class Node {
  id: string = "";
  children: Children[] = [];
  parents: string[] = [];
  text: Text = new Text();
  shapeType: ShapeType = "Rect";
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  fillStyle: string = "";
  strokeStyle: string = "";

  constructor(
    id: string,
    children: Children[],
    parents: string[],
    text: Text,
    shapeType: ShapeType,
    x: number,
    y: number,
    width: number,
    height: number,
    fillStyle: string,
    strokeStyle: string
  ) {
    this.id = id;
    this.children = children;
    this.parents = parents;
    this.text = text;
    this.shapeType = shapeType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
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
  font: string;
  fontSize: number;
  fontBold: boolean;
  align: string;
  verticalAlign: string;
  fontColor: string;
  highlightColor: string;

  shapeType: ShapeType;
  strokeStyle: string;
  strokeWidth: number;
  fillStyle: string;
};

export type History = {
  type: "add" | "delete" | "update";
  diff: null | string[];
  nodes: Map<string, Node>;
};

export type UserCursor = {
  x: number;
  y: number;
};

export type BoardUser = {
  name: string | null;
  avatarUrl: string | null;
  color: string;
};

type IBoardContext = {
  nodes: Map<string, Node>;
  setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  editorValue: EditorType;
  setEditorValue: React.Dispatch<React.SetStateAction<EditorType>>;
  boardAction: BoardAction;
  setBoardAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  canDragStage: boolean;
  setCanDragStage: React.Dispatch<React.SetStateAction<boolean>>;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
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
  history: History[];
  setHistory: React.Dispatch<React.SetStateAction<History[]>>;
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  boardId: string | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | undefined>>;
  userCursors: Map<string, UserCursor>;
  setUserCursors: React.Dispatch<React.SetStateAction<Map<string, UserCursor>>>;
  boardUsers: Map<string, BoardUser>;
  setBoardUsers: React.Dispatch<React.SetStateAction<Map<string, BoardUser>>>;
  boardName: string;
  setBoardName: React.Dispatch<React.SetStateAction<string>>;
};

export const BoardContext: React.Context<IBoardContext> = createContext({} as IBoardContext);

export const BoardContextProvider: React.FC<BoardContextProps> = ({ children }) => {
  const [stageRef, setStageRef] = useState<React.RefObject<Konva.Stage> | null>(null);
  const [layerRef, setLayerRef] = useState<React.RefObject<Konva.Layer> | null>(null);
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("Rect");
  const [fillStyle, setFillStyle] = useState<string>("#fff");
  const [strokeStyle, setStrokeStyle] = useState<string>("#000");
  const [lineStyle, setLineStyle] = useState<string>("#000");
  const [selectedShapes, setSelectedShapes] = useState<Konva.Group[]>([]);
  const [stageConfig, setStageConfig] = useState<StageConfig>({
    stageScale: 0.8,
    stageX: 0,
    stageY: 0,
  });
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
  const [history, setHistory] = useState<History[]>([
    {
      type: "update",
      diff: null,
      nodes: new Map(),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [boardId, setBoardId] = useState<string | undefined>();
  const [boardName, setBoardName] = useState<string>("");
  const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map());
  const [boardUsers, setBoardUsers] = useState<Map<string, BoardUser>>(new Map());
  const [boardAction, setBoardAction] = useState<BoardAction>(BoardAction.Select);
  const [editorValue, setEditorValue] = useState<EditorType>({
    shapeType: "Rect",
    strokeStyle: "#000",
    strokeWidth: 1,
    fillStyle: "transparent",

    font: "Arial",
    fontSize: 12,
    fontBold: false,
    align: "left",
    verticalAlign: "top",
    fontColor: "#000",
    highlightColor: "transparent",
  });

  const value = useMemo(
    () => ({
      stageRef,
      setStageRef,
      nodes,
      setNodes,
      selectedNode,
      setSelectedNode,
      shapeType,
      setShapeType,
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
      history,
      setHistory,
      historyIndex,
      setHistoryIndex,
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
    }),
    [
      nodes,
      selectedNode,
      selectedShapes,
      stageConfig,
      stageStyle,
      shapeType,
      fillStyle,
      strokeStyle,
      lineStyle,
      displayColorPicker,
      dark,
      history,
      historyIndex,
      stageRef,
      boardId,
      userCursors,
      boardUsers,
      boardName,
      canDragStage,
      boardAction,
      layerRef,
      editorValue,
    ]
  );

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
