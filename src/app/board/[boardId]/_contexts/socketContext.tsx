"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { Node, BoardContext, BoardUser, UserCursor } from "../_contexts/boardContext";

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

const WS = process.env.SERVER_HOST || "http://localhost:3001";

export const SocketContext = createContext<ISocketContext>({} as ISocketContext);

const socket = socketIOClient(WS);

export const SocketContextProvider: React.FC<SocketContextProps> = ({ children }) => {
    const { setNodes, setBoardUsers, setUserCursors } = useContext(BoardContext);

    const connectionSuccess = () => {
        console.log("connection successful!");
    };

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

    useEffect(() => {
        socket.on("connection-success", connectionSuccess);
        socket.on("get-board-users", getBoardUsers);
        socket.on("user-joined", userJoined);
        socket.on("user-left", userLeft);
        socket.on("get-board-update", getBoardUpdate);
        socket.on("get-board-delete-nodes", getBoardDeleteNodes);
        socket.on("get-user-mouse-update", getUserMouseUpdate);

        return () => {
            socket.off("connection-success", connectionSuccess);
            socket.off("get-board-users", getBoardUsers);
            socket.off("user-joined", userJoined);
            socket.off("user-left", userLeft);
            socket.off("get-board-update", getBoardUpdate);
            socket.off("get-board-delete-nodes", getBoardDeleteNodes);
            socket.off("get-user-mouse-update", getUserMouseUpdate);
        };
    }, [getBoardUpdate, getBoardDeleteNodes, userJoined, userLeft, getUserMouseUpdate, getBoardUsers]);

    const value = useMemo(
        () => ({
            socket,
        }),
        []
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
