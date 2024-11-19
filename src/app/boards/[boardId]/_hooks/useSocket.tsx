import { useLoggedInUser } from "@/lib/services/queries";
import { useCallback, useContext } from "react";
import { BoardContext, Node, UserCursor, Path, History } from "../_contexts/boardContext";
import {
  AddNodePayload,
  AddPathPayload,
  PresentationsPayload,
  SocketContext,
} from "../_contexts/socketContext";

const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const { boardId, setUndoStack, isJoinedPresentation, setIsJoinedPresentation } =
    useContext(BoardContext);
  const user = useLoggedInUser();

  const joinBoard = useCallback(() => {
    if (!socket || !boardId || !user) return;
    socket.emit("joinBoard", boardId);
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
    (data: PresentationsPayload) => {
      socket.emit("start-presentation", { boardId, data });
      setIsJoinedPresentation(true);
    },
    [socket, boardId]
  );

  const joinPresentation = useCallback(() => {
    if (!socket || !boardId || !user) return;
    socket.emit("join-presentation", boardId);
    setIsJoinedPresentation(true);
  }, [socket, boardId]);

  const leavePresentation = useCallback(() => {
    if (!socket || !boardId) return;
    socket.emit("leave-presentation", boardId);
  }, [socket, boardId]);

  const endPresentation = useCallback(() => {
    if (!socket || !boardId) return;
    socket.emit("end-presentation");
  }, [socket, boardId]);

  const dragWhilePresenting = useCallback(
    (data: PresentationsPayload) => {
      socket.emit("drag-while-presenting", { boardId, data });
    },
    [socket, boardId]
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
  };
};

export default useSocket;
