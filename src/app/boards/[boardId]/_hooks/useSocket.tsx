import { useLoggedInUser } from "@/lib/services/queries";
import { useCallback, useContext } from "react";
import { BoardContext, Node, UserCursor, Path } from "../_contexts/boardContext";
import {
  AddNodePayload,
  AddPathPayload,
  DeleteBoardNodesPayload,
  SocketContext,
  UpdateBoardPayload,
  UpdateBoardTypes,
} from "../_contexts/socketContext";

const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const { boardId } = useContext(BoardContext);
  const user = useLoggedInUser();

  const joinBoard = useCallback(() => {
    if (!socket || !boardId || !user) return;
    socket.emit("joinBoard", boardId);
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

  const addNode = useCallback(
    (data: Node) => {
      if (!socket || !boardId) return;
      const payload: AddNodePayload = {
        boardId,
        data,
      };
      socket.emit("add-node", payload);
    },
    [socket, boardId]
  );

  const addPath = useCallback(
    (data: Path) => {
      if (!socket || !boardId) return;
      const payload: AddPathPayload = {
        boardId,
        data,
      };
      socket.emit("add-path", payload);
    },
    [socket, boardId]
  );

  const updateNode = useCallback(
    (nodeId: string, data: Node) => {
      if (!socket || !boardId) return;
      const payload = {
        boardId,
        data,
      };
      socket.emit("update-node", payload);
    },
    [socket, boardId]
  );

  const updatePath = useCallback(
    (pathId: string, data: Path) => {
      if (!socket || !boardId) return;
      const payload = {
        boardId,
        data,
      };
      socket.emit("update-path", payload);
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

  return {
    joinBoard,
    leaveBoard,
    updateUserMouse,
    updateBoard,
    deleteBoardNodes,
    addNode,
    addPath,
    updateNode,
    updatePath,
  };
};

export default useSocket;
