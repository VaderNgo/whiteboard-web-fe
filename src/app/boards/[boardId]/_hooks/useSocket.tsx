import { useLoggedInUser } from "@/lib/services/queries";
import { useCallback, useContext } from "react";
import { BoardContext, Node, UserCursor, Path, History } from "../_contexts/boardContext";
import { AddNodePayload, AddPathPayload, SocketContext } from "../_contexts/socketContext";

const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const { boardId, setUndoStack } = useContext(BoardContext);
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
      console.log("addNode", payload);
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
      console.log("addPath", data);
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

  return {
    joinBoard,
    leaveBoard,
    addNode,
    addPath,
    updateNode,
    updatePath,
  };
};

export default useSocket;
