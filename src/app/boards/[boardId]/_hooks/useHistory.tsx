import { useCallback, useContext } from "react";
import { History, BoardContext } from "../_contexts/boardContext";
import useSocket from "./useSocket";

export const useHistory = () => {
  const { setNodes, history, setHistory, historyIndex, setHistoryIndex } = useContext(BoardContext);
  const { updateBoard } = useSocket();

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const currHistory = history[prevIndex];
      const prevNodes = new Map(history[prevIndex].nodes);
      const updatedNodesToSave = Array.from(prevNodes.values());

      if (currHistory.type === "add") {
        //handleUndoAdd
      } else {
        //saveUpdateNodes
      }
      setNodes(prevNodes);
      setHistoryIndex(prevIndex);
      updateBoard(updatedNodesToSave, "history");
    }
  }, [historyIndex, history, setNodes, setHistoryIndex, updateBoard]); //handleUndoAdd, saveUpdateNodes

  const handleRedo = useCallback(() => {
    if (history.length - 1 > historyIndex) {
      const nextIndex = historyIndex + 1;
      const nextHistory = history[nextIndex];
      const nextNodes = new Map(history[nextIndex].nodes);
      const updatedNodesToSave = Array.from(nextNodes.values());

      if (nextHistory.type === "add") {
        //handleRedoAdd
      } else {
        //saveUpdateNodes
      }

      setNodes(nextNodes);
      setHistoryIndex(nextIndex);
      updateBoard(updatedNodesToSave, "history");
    }
  }, [historyIndex, history, setNodes, setHistoryIndex, updateBoard]); //handleRedoAdd, saveUpdateNodes

  const undoByShortCutKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
        handleUndo();
      }
    },
    [handleUndo]
  );

  const redoByShortCutKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyY" && (e.ctrlKey || e.metaKey)) {
        handleRedo();
      }
    },
    [handleRedo]
  );

  const addToHistory = ({ type, diff, nodes: updatedNodes }: History) => {
    const newUpdatedNodes = new Map(updatedNodes);
    const newHistory = [...history];
    setHistory([
      ...newHistory,
      {
        type,
        diff,
        nodes: newUpdatedNodes,
      },
    ]);
    const len = history.length;
    setHistoryIndex(len);
  };

  return { handleUndo, handleRedo, undoByShortCutKey, redoByShortCutKey, addToHistory };
};

export default useHistory;
