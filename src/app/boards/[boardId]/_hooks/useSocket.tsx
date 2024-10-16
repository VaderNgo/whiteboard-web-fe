import { useCallback, useContext } from "react";
import { Node, BoardContext, UserCursor } from "../_contexts/boardContext";
import {
    SocketContext,
    UpdateBoardPayload,
    DeleteBoardNodesPayload,
    UpdateBoardTypes,
} from "../_contexts/socketContext";

const useSocket = () => {
    const { socket } = useContext(SocketContext);
    const { boardId } = useContext(BoardContext);
    //authstate context;

    const joinBoard = useCallback(() => {
        if (!socket || !boardId)
            // ||!auth
            return;
        socket.emit("joinBoard", { boardId, user: { name: "fill authenticated user's name here", avatarUrl: "..." } });
    }, [socket, boardId]); // authenState.user

    const leaveBoard = useCallback(() => {
        if (!socket || !boardId) return;
        socket.emit("leaveBoard", { boardId });
    }, [socket, boardId]);

    const updateUserMouse = useCallback(
        (userCursor: UserCursor) => {
            if (!socket || !boardId) return;
            socket.emit("update-user-mouse", { boardId, userCursor });
        },
        [socket, boardId]
    );

    const updateBoard = useCallback(
        (data: Node[], type: UpdateBoardTypes) => {
            if (!socket || !boardId) return;
            const payload: UpdateBoardPayload = {
                boardId,
                type: type,
                data,
            };
            socket.emit("update-board", payload);
        },
        [socket, boardId]
    );

    const deleteBoardNodes = useCallback(
        (nodesToUpdate: Node[], nodesToDelete: Node[]) => {
            if (!socket || !boardId) return;
            const payload: DeleteBoardNodesPayload = {
                boardId,
                data: { nodesToUpdate, nodesToDelete },
            };
            socket.emit("delete-board-nodes", payload);
        },
        [socket, boardId]
    );

    return { joinBoard, leaveBoard, updateUserMouse, updateBoard, deleteBoardNodes };
};

export default useSocket;
