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
  StageConfig,
  BoardAction,
} from "../_contexts/boardContext";
import { socket } from "@/lib/websocket";
import { LoggedInUser, useLoggedInUser, UserBoard } from "@/lib/services/queries";
import { Permission } from "@/lib/permission-enum";
import { toast } from "@/hooks/use-toast";

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

export type PresentationState = {
  participants: Map<string, LoggedInUser>;
  presentation: StageConfig | null;
  presenter: LoggedInUser | null;
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
  const {
    setNodes,
    setBoardUsers,
    setPaths,
    boardUsers,
    setPresentation,
    setIsJoinedPresentation,
    setBoardAction,
    setUsersBoard,
  } = useContext(BoardContext);

  const { data: loggedUser } = useLoggedInUser();
  const onGetBoardUsers = useCallback(
    (payload: { socketId: string; enhancedUser: LoggedInUser }[]) => {
      setBoardUsers((prevState) => {
        return new Map(payload.map(({ socketId, enhancedUser }) => [socketId, enhancedUser]));
      });
    },
    [setBoardUsers]
  );

  const onUserJoined = useCallback(
    (payload: { socketId: string; enhancedUser: LoggedInUser }[]) => {
      setBoardUsers((prevState) => {
        return new Map(payload.map(({ socketId, enhancedUser }) => [socketId, enhancedUser]));
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

  const onStartPresentation = useCallback(
    (payload: PresentationState) => {
      setPresentation({
        presentation: payload.presentation,
        participants: new Map(),
        presenter: payload.presenter,
      });
      setIsJoinedPresentation(true);
    },
    [setPresentation]
  );

  const onEndPresentation = useCallback(() => {
    setPresentation(null);
    setIsJoinedPresentation(false);
  }, [setPresentation]);

  const onJoinPresentation = useCallback(
    (payload: {
      presentation: StageConfig;
      participants: { socketId: string; enhancedUser: LoggedInUser }[];
    }) => {
      setPresentation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          presentation: payload.presentation,
          participants: new Map(
            payload.participants.map(({ socketId, enhancedUser }) => [socketId, enhancedUser])
          ),
        };
      });
    },
    [setPresentation]
  );

  const onLeavePresentation = useCallback(
    (payload: { participants: { socketId: string; enhancedUser: LoggedInUser }[] }) => {
      setPresentation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          participants:
            payload.participants && payload.participants.length !== 0
              ? new Map(
                  payload.participants.map(({ socketId, enhancedUser }) => [socketId, enhancedUser])
                )
              : new Map(),
        };
      });
    },
    [setPresentation]
  );

  const onDragWhilePresenting = useCallback(
    (payload: StageConfig) => {
      setPresentation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          presentation: payload,
        };
      });
    },
    [setPresentation]
  );

  const onPresentationUsers = useCallback(
    (payload: { socketId: string; enhancedUser: LoggedInUser }[]) => {
      setPresentation((prev) => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          participants: new Map(
            payload.map(({ socketId, enhancedUser }) => [socketId, enhancedUser])
          ),
        };
      });
    },
    [setPresentation]
  );
  const onUpdateUserBoardPermission = useCallback(
    (payload: { usersBoard: UserBoard[]; userId: number; permission: Permission }) => {
      setUsersBoard(
        new Map(payload.usersBoard.map((userBoard) => [userBoard.user.id.toString(), userBoard]))
      );
      if (loggedUser?.id === payload.userId) {
        toast({
          title: "Permission Updated",
          description: `Your permission has been updated to ${payload.permission}`,
        });
      }
    },
    [setUsersBoard, loggedUser]
  );

  const onError = useCallback((error: { message: string }) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }, []);

  useEffect(() => {
    socket.on("add-node", onAddNode);
    socket.on("add-path", onAddPath);
    socket.on("update-node", onUpdateNode);
    socket.on("update-path", onUpdatePath);
    socket.on("board-users", onGetBoardUsers);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("start-presentation", onStartPresentation);
    socket.on("end-presentation", onEndPresentation);
    socket.on("join-presentation", onJoinPresentation);
    socket.on("leave-presentation", onLeavePresentation);
    socket.on("drag-while-presenting", onDragWhilePresenting);
    socket.on("presentation-users", onPresentationUsers);
    socket.on("users-board", onUpdateUserBoardPermission);
    socket.on("error", onError);
    return () => {
      socket.off("add-node", onAddNode);
      socket.off("add-path", onAddPath);
      socket.off("update-node", onUpdateNode);
      socket.off("update-path", onUpdatePath);
      socket.off("board-users", onGetBoardUsers);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("start-presentation", onStartPresentation);
      socket.off("end-presentation", onEndPresentation);
      socket.off("join-presentation", onJoinPresentation);
      socket.off("leave-presentation", onLeavePresentation);
      socket.off("drag-while-presenting", onDragWhilePresenting);
      socket.off("presentation-users", onPresentationUsers);
      socket.off("users-board", onUpdateUserBoardPermission);
      socket.off("error", onError);
    };
  }, [
    onAddNode,
    onAddPath,
    onUpdateNode,
    onUpdatePath,
    onGetBoardUsers,
    onUserJoined,
    onUserLeft,
    onStartPresentation,
    onEndPresentation,
    onJoinPresentation,
    onLeavePresentation,
    onDragWhilePresenting,
    onPresentationUsers,
    onUpdateUserBoardPermission,
    onError,
  ]);

  const value = useMemo(
    () => ({
      socket,
    }),
    []
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
