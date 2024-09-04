"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Konva from "konva";

export type ShapeType = "Rect" | "Circle" | "Line";

type BoardContextProps = {
    children: React.ReactNode;
};

export type Children = {
    id: string;
    color: string;
};

export type Node = {
    id: string;
    children: Children[];
    parents: string[];
    text: string;
    shapeType: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    fillStyle: string;
    strokeStyle: string;
};

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
        ]
    );

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
