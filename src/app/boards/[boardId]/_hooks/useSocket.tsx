import { useLoggedInUser } from "@/lib/services/queries";
import { useCallback, useContext, useEffect } from "react";
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
    usersBoard,
    userCursors,
    setNodes,
    setPaths,
    setBoardOwner,
    setBoardName,
    setBoardUsers,
    setUserCursors,
  } = useContext(BoardContext);
  const user = useLoggedInUser();

  // Utility function to check if the current user has view-only permissions
  const isViewOnly = useCallback(() => {
    if (!user?.data?.id) return false;
    const userPermission = usersBoard.get(user.data.id.toString())?.permission;
    return userPermission === Permission.VIEW;
  }, [user, usersBoard]);

  const isPresenter = useCallback(() => {
    if (!user?.data?.id) return false;
    return presentation?.presenter?.id == user.data.id && presentation;
  }, [user, presentation, usersBoard]);

  useEffect(() => {}, [usersBoard]);

  const joinBoard = useCallback(() => {
    if (!socket || !boardId || !user) return;
    socket.emit("joinBoard", boardId);
    setBoardAction(BoardAction.Select);
  }, [socket, boardId]);

  const leaveBoard = useCallback(() => {
    if (!socket || !boardId) return;
    socket.emit("leaveBoard", { boardId });
    // Clear local state
    setNodes(new Map());
    setPaths(new Map());
    setBoardUsers(new Map());
    setUserCursors(new Map());
  }, [socket, boardId]);

  const addNode = useCallback(
    (data: Node) => {
      if (!socket || !boardId || isPresenter() || isViewOnly()) return;
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
    [socket, boardId, isViewOnly]
  );

  const addPath = useCallback(
    (data: Path) => {
      if (!socket || !boardId || isPresenter() || isViewOnly()) return;
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
    [socket, boardId, isViewOnly]
  );

  const updateNode = useCallback(
    (nodeId: string, data: Node) => {
      if (!socket || !boardId || isViewOnly()) return;
      const payload = {
        boardId,
        nodeId,
        data,
      };
      socket.emit("update-node", payload);
    },
    [socket, boardId, isViewOnly]
  );

  const updatePath = useCallback(
    (pathId: string, data: Path) => {
      if (!socket || !boardId || isViewOnly()) return;
      const payload = {
        boardId,
        pathId,
        data,
      };
      socket.emit("update-path", payload);
    },
    [socket, boardId, isViewOnly]
  );

  const startPresentation = useCallback(
    (data: StageConfig) => {
      if (!socket || !boardId || isViewOnly()) return;
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
    [socket, boardId, user, isViewOnly]
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
      if (!socket || !boardId || presentation?.presenter!.id != user.data?.id || isViewOnly())
        return;
      socket.emit("drag-while-presenting", {
        boardId,
        data,
      });
    },
    [socket, boardId, presentation, user, isViewOnly]
  );

  const updateUserBoardPermission = useCallback(
    (payload: { boardId: number; userId: number; permission: Permission }) => {
      socket.emit("update-user-board-permission", payload);
    },
    [socket, boardId]
  );

  const handleCursor = useCallback(
    (payload: { position: { x: number; y: number } }) => {
      if (!socket || !boardId) return;
      socket.emit("cursor-move", { boardId: boardId, position: payload.position });
    },
    [socket, boardId, usersBoard, user]
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
    handleCursor,
  };
};

export default useSocket;
