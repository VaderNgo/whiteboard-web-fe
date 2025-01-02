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
    if (!presentation) return true; // If there's no presentation, allow the action
    if (!user?.data?.id || !presentation?.presenter?.id) return false; // Prevent if user or presenter details are missing
    return presentation.presenter.id === user.data.id; // Check if the current user is the presenter
  }, [user, presentation]);

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
    setUserCursors(new Map());
    setBoardOwner(null);
    setPresentation(null);
    setIsJoinedPresentation(false);
    setUndoStack([]);
    setBoardAction(BoardAction.Select);
    socket.disconnect();
  }, [socket, boardId]);

  const addNode = useCallback(
    (data: Node) => {
      console.log(socket, boardId, isPresenter(), isViewOnly());
      if (!socket || !boardId || !isPresenter() || isViewOnly()) return;
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
    [socket, boardId, isViewOnly, isPresenter]
  );

  const addPath = useCallback(
    (data: Path) => {
      if (!socket || !boardId || !isPresenter() || isViewOnly()) return;
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
      socket.emit("cursor-move", {
        boardId: boardId,
        position: payload.position,
        stagePosition: { x: stageConfig.stageX, y: stageConfig.stageY },
        stageScale: stageConfig.stageScale,
      });
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
