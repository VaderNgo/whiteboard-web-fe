import { useLoggedInUser } from "@/lib/services/queries";
import { useCallback, useContext } from "react";
import {
  BoardContext,
  Node,
  UserCursor,
  Path,
  History,
  StageConfig,
  BoardAction,
} from "../_contexts/boardContext";
import { AddNodePayload, AddPathPayload, SocketContext } from "../_contexts/socketContext";
import { Permission } from "@/lib/permission-enum";

const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const {
    boardId,
    setUndoStack,
    isJoinedPresentation,
    setIsJoinedPresentation,
    presentation,
    stageConfig,
    setPresentation,
    setBoardAction,
  } = useContext(BoardContext);
  const user = useLoggedInUser();

  const joinBoard = useCallback(() => {
    if (!socket || !boardId || !user) return;
    socket.emit("joinBoard", boardId);
    setBoardAction(BoardAction.Select);
  }, [socket, boardId]); // authenState.user

  const leaveBoard = useCallback(() => {
    if (!socket || !boardId) return;
    socket.emit("leaveBoard", { boardId });
  }, [socket, boardId]);

  const addNode = useCallback(
    (data: Node) => {
      if (!socket || !boardId) return;
      const payload: AddNodePayload = {
        boardId,
        data,
      };
      setUndoStack((prev) => {
        const newHistory = { action: "add", nodeData: data, type: "node" };
        return [...prev, newHistory as History];
      });
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
      setUndoStack((prev) => {
        const newHistory = { action: "add", pathData: data, type: "path" };
        return [...prev, newHistory as History];
      });
      socket.emit("add-path", payload);
    },
    [socket, boardId]
  );

  const updateNode = useCallback(
    (nodeId: string, data: Node) => {
      if (!socket || !boardId) return;
      const payload = {
        boardId,
        nodeId,
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
        pathId,
        data,
      };

      socket.emit("update-path", payload);
    },
    [socket, boardId]
  );

  const startPresentation = useCallback(
    (data: StageConfig) => {
      if (!socket || !boardId) return;
      socket.emit("start-presentation", {
        boardId,
        data,
      });
      setPresentation({
        presentation: data,
        participants: new Map(),
        presenter: user.data!,
      });
      setIsJoinedPresentation(true);
    },
    [socket, boardId, user]
  );

  const joinPresentation = useCallback(() => {
    if (!socket || !boardId || !user) return;
    socket.emit("join-presentation", boardId);
    setIsJoinedPresentation(true);
  }, [socket, boardId, user]);

  const leavePresentation = useCallback(() => {
    if (!socket || !boardId) return;
    socket.emit("leave-presentation", boardId);
    setIsJoinedPresentation(false);
  }, [socket, boardId, setIsJoinedPresentation]);

  const endPresentation = useCallback(() => {
    if (!socket || !boardId || presentation?.presenter!.id != user.data?.id) return;
    socket.emit("end-presentation", boardId);
    setPresentation(null);
    setIsJoinedPresentation(false);
  }, [socket, boardId, presentation, user, setIsJoinedPresentation]);

  const dragWhilePresenting = useCallback(
    (data: StageConfig) => {
      if (!socket || !boardId || presentation?.presenter!.id != user.data?.id) return;
      socket.emit("drag-while-presenting", {
        boardId,
        data,
      });
    },
    [socket, boardId, presentation, user]
  );

  const updateUserBoardPermission = useCallback(
    (payload: { boardId: number; userId: number; permission: Permission }) => {
      socket.emit("update-user-board-permission", payload);
    },
    [socket, boardId, user]
  );

  return {
    joinBoard,
    leaveBoard,
    addNode,
    addPath,
    updateNode,
    updatePath,
    startPresentation,
    joinPresentation,
    leavePresentation,
    endPresentation,
    dragWhilePresenting,
    updateUserBoardPermission,
  };
};

export default useSocket;
