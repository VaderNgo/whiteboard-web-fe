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

type SocketContextProps = {
  children: React.ReactNode;
};

type ISocketContext = {
  socket: Socket;
};

export type UpdateBoardTypes = "update" | "history";

export type UpdateBoardPayload = {
  boardId: string;
  type: UpdateBoardTypes;
  data: Node[];
};

export type DeleteBoardNodesPayload = {
  boardId: string;
  data: {
    nodesToUpdate: Node[];
    nodesToDelete: Node[];
  };
};

export type UserJoinedPayload = {
  socketId: string;
  user: BoardUser;
};

export type GetUserMouseUpdatePayload = {
  socketId: string;
  userCursor: UserCursor;
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
  const { setNodes, setBoardUsers, setUserCursors, setPaths } = useContext(BoardContext);

  const getBoardUsers = useCallback(
    (payload: UserJoinedPayload[]) => {
      const userCursors: Map<string, UserCursor> = new Map();
      const roomUsers: Map<string, BoardUser> = new Map();
      payload.forEach((user) => {
        roomUsers.set(user.socketId, user.user);
        userCursors.set(user.socketId, { x: 0, y: 0 });
      });
      setBoardUsers(roomUsers);
      setUserCursors(userCursors);
    },
    [setBoardUsers, setUserCursors]
  );

  const userJoined = useCallback(
    (payload: UserJoinedPayload) => {
      const { socketId, user } = payload;
      setBoardUsers((prevState) => {
        prevState.set(socketId, user);
        return new Map(prevState);
      });
      setUserCursors((prevState) => {
        prevState.set(socketId, { x: 0, y: 0 });
        return new Map(prevState);
      });
    },
    [setBoardUsers, setUserCursors]
  );

  const userLeft = useCallback(
    ({ socketId }: { socketId: string }) => {
      setBoardUsers((prevState) => {
        prevState.delete(socketId);
        return new Map(prevState);
      });
      setUserCursors((prevState) => {
        prevState.delete(socketId);
        return new Map(prevState);
      });
    },
    [setBoardUsers, setUserCursors]
  );

  const getBoardUpdate = useCallback(
    (payload: UpdateBoardPayload) => {
      const { data } = payload;
      if (payload.type === "update") {
        if (data) {
          data.forEach((node) => {
            setNodes((prevState) => {
              prevState.set(node.id, node);
              return new Map(prevState);
            });
          });
        }
      }
      if (payload.type === "history") {
        if (data) {
          const updatedNodes: Map<string, Node> = new Map();
          data.forEach((node) => {
            updatedNodes.set(node.id, node);
          });
          setNodes(updatedNodes);
        }
      }
    },
    [setNodes]
  );

  // get-user-mouse-update
  const getUserMouseUpdate = useCallback(
    (payload: GetUserMouseUpdatePayload) => {
      const { socketId, userCursor } = payload;
      setUserCursors((prevState) => {
        prevState.set(socketId, userCursor);
        return new Map(prevState);
      });
    },
    [setUserCursors]
  );

  // get-room-delete-nodes
  const getBoardDeleteNodes = useCallback(
    (payload: DeleteBoardNodesPayload) => {
      const { data } = payload;
      if (data) {
        const { nodesToUpdate, nodesToDelete } = data;
        setNodes((prevState) => {
          const updatedNodes = new Map(prevState);
          nodesToUpdate.forEach((node) => {
            updatedNodes.set(node.id, node);
          });
          nodesToDelete.forEach((node) => {
            updatedNodes.delete(node.id);
          });
          return updatedNodes;
        });
      }
    },
    [setNodes]
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
    // socket.on("connection-success", connectionSuccess);
    // socket.on("get-board-users", getBoardUsers);
    // socket.on("user-joined", userJoined);
    // socket.on("user-left", userLeft);
    // socket.on("get-board-update", getBoardUpdate);
    // socket.on("get-board-delete-nodes", getBoardDeleteNodes);
    // socket.on("get-user-mouse-update", getUserMouseUpdate);

    socket.on("add-node", onAddNode);
    socket.on("add-path", onAddPath);
    socket.on("update-node", onUpdateNode);
    socket.on("update-path", onUpdatePath);

    return () => {
      // socket.off("connection-success", connectionSuccess);
      // socket.off("get-board-users", getBoardUsers);
      // socket.off("user-joined", userJoined);
      // socket.off("user-left", userLeft);
      // socket.off("get-board-update", getBoardUpdate);
      // socket.off("get-board-delete-nodes", getBoardDeleteNodes);
      // socket.off("get-user-mouse-update", getUserMouseUpdate);
      socket.off("add-node", onAddNode);
      socket.off("add-path", onAddPath);
      socket.off("update-node", onUpdateNode);
      socket.off("update-path", onUpdatePath);
    };
  }, [
    // getBoardUpdate,
    // getBoardDeleteNodes,
    // userJoined,
    // userLeft,
    // getUserMouseUpdate,
    // getBoardUsers,
    onAddNode,
    onAddPath,
    onUpdateNode,
    onUpdatePath,
  ]);

  const value = useMemo(
    () => ({
      socket,
    }),
    []
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
