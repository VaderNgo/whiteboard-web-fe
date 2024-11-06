"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import {
  Node,
  BoardContext,
  BoardUser,
  UserCursor,
  Path,
  Text,
  AnchorPoint,
  PathEdge,
  PathPoint,
} from "../_contexts/boardContext";
import { socket } from "@/lib/websocket";
import { LoggedInUser } from "@/lib/services/queries";

type SocketContextProps = {
  children: React.ReactNode;
};

type ISocketContext = {
  socket: Socket;
};

export type UserJoinedPayload = {
  socketId: string;
  user: LoggedInUser;
};

export type AddNodePayload = {
  boardId: string;
  data: Node;
};

export type AddPathPayload = {
  boardId: string;
  data: Path;
};

export type UpdateNodePayload = {
  boardId: string;
  nodeId: string;
  data: Node;
};

export type UpdatePathPayload = {
  boardId: string;
  pathId: string;
  data: Path;
};

export const convertToNode = (s: Node): Node => {
  const text = new Text().setAttrs(s.text);
  const anchorPoints = s.anchorPoints.map((ap) => new AnchorPoint().setAttrs(ap));
  return new Node().setAttrs({ ...s, text, anchorPoints });
};

export const convertToPath = (p: Path): Path => {
  const edges = p.edges.map((e) => new PathEdge().setAttrs(e));
  const extrudableEdges = p.extrudableEdges.map((e) => new PathEdge().setAttrs(e));
  const points = p.points.map((p) => new PathPoint().setAttrs(p));
  return new Path().setAttrs({ ...p, edges, extrudableEdges, points });
};

const WS = process.env.SERVER_HOST || "http://localhost:3001";

export const SocketContext = createContext<ISocketContext>({} as ISocketContext);

export const SocketContextProvider: React.FC<SocketContextProps> = ({ children }) => {
  const { setNodes, setBoardUsers, setPaths, boardUsers } = useContext(BoardContext);

  const onGetBoardUsers = useCallback(
    (payload: { socketId: string; user: LoggedInUser }[]) => {
      setBoardUsers((prevState) => {
        return new Map(payload.map(({ socketId, user }) => [socketId, user]));
      });
    },
    [setBoardUsers]
  );

  const onUserJoined = useCallback(
    (payload: UserJoinedPayload) => {
      setBoardUsers((prevState) => {
        prevState.set(payload.socketId, payload.user);
        return new Map(prevState);
      });
    },
    [setBoardUsers]
  );

  const onUserLeft = useCallback(
    (socketId: string) => {
      setBoardUsers((prevState) => {
        const updatedState = new Map(prevState);
        updatedState.delete(socketId);
        return updatedState;
      });

      console.log("user left", socketId);
    },
    [setBoardUsers]
  );

  const onAddNode = useCallback(
    (payload: AddNodePayload) => {
      const { data } = payload;
      setNodes((prevState) => {
        const newNode = convertToNode(data);
        prevState.set(newNode.id, newNode);
        return new Map(prevState);
      });
    },
    [setNodes]
  );

  const onAddPath = useCallback(
    (payload: AddPathPayload) => {
      const { data } = payload;
      setPaths((prevState) => {
        const newPath = convertToPath(data);
        prevState.set(newPath.id, newPath);
        return new Map(prevState);
      });
    },
    [setPaths]
  );

  const onUpdateNode = useCallback(
    (payload: UpdateNodePayload) => {
      const { nodeId, data } = payload;
      setNodes((prevState) => {
        const newNode = convertToNode(data);
        prevState.set(nodeId, newNode);
        return new Map(prevState);
      });
    },
    [setNodes]
  );

  const onUpdatePath = useCallback(
    (payload: UpdatePathPayload) => {
      const { pathId, data } = payload;
      setPaths((prevState) => {
        const newPath = convertToPath(data);
        prevState.set(pathId, newPath);
        return new Map(prevState);
      });
    },
    [setPaths]
  );

  useEffect(() => {
    socket.on("add-node", onAddNode);
    socket.on("add-path", onAddPath);
    socket.on("update-node", onUpdateNode);
    socket.on("update-path", onUpdatePath);
    socket.on("board-users", onGetBoardUsers);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);

    return () => {
      socket.off("add-node", onAddNode);
      socket.off("add-path", onAddPath);
      socket.off("update-node", onUpdateNode);
      socket.off("update-path", onUpdatePath);
      socket.off("board-users", onGetBoardUsers);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
    };
  }, [onAddNode, onAddPath, onUpdateNode, onUpdatePath, onGetBoardUsers, onUserJoined, onUserLeft]);

  const value = useMemo(
    () => ({
      socket,
    }),
    []
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
