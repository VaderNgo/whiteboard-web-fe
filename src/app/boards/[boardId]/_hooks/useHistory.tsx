import { useCallback, useContext } from "react";
import { History, BoardContext, Node, Path } from "../_contexts/boardContext";
import useSocket from "./useSocket";

export const useHistory = () => {
  const { nodes, setNodes, undoStack, redoStack, setUndoStack, setRedoStack, paths, setPaths } =
    useContext(BoardContext);
  const { addNode, addPath, updateNode, updatePath } = useSocket();

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) {
      console.log("undoStack is empty");
      return;
    }
    const history = undoStack.pop();
    if (!history) return;
    if (history.type === "node") {
      switch (history.action) {
        case "add": {
          const node = history.nodeData;
          if (!node) return;
          node.setAttrs({ deleted: true });
          setNodes((prev) => {
            prev.set(node.id, node);
            return new Map(prev);
          });
          setRedoStack((prev) => {
            const newHistory = { action: "add", nodeData: node, type: "node" };
            return [...prev, newHistory as History];
          });
          updateNode(node.id, node);
          break;
        }
        case "update": {
          const node = history.nodeData;
          if (!node) return;
          console.log("undo update", node);
          const currentNode = nodes.get(node.id);
          setNodes((prev) => {
            const updatedNode = new Node().setAttrs({ ...node });
            prev.set(node.id, updatedNode);
            return new Map(prev);
          });
          setRedoStack((prev) => {
            const newHistory = { action: "update", nodeData: currentNode, type: "node" };
            return [...prev, newHistory as History];
          });
          updateNode(node.id, node);
          break;
        }
        case "delete": {
          const node = history.nodeData;
          if (!node) return;
          node.setAttrs({ deleted: false });
          setNodes((prev) => {
            prev.set(node.id, node);
            return new Map(prev);
          });
          setRedoStack((prev) => {
            const newHistory = { action: "delete", nodeData: node, type: "node" };
            return [...prev, newHistory as History];
          });
          updateNode(node.id, node);
          break;
        }
      }
    } else {
      switch (history.action) {
        case "add": {
          const path = history.pathData;
          if (!path) return;
          path.setAttrs({ deleted: true });
          setPaths((prev) => {
            prev.set(path.id, path);
            return new Map(prev);
          });
          setRedoStack((prev) => {
            const newHistory = { action: "add", pathData: path, type: "path" };
            return [...prev, newHistory as History];
          });
          updatePath(path.id, path);
          break;
        }
        case "update": {
          const path = history.pathData;
          if (!path) return;
          console.log("redo update", path);
          const currentPath = paths.get(path.id);
          setPaths((prev) => {
            const updatedPath = new Path().setAttrs({ ...path });
            prev.set(path.id, updatedPath);
            return new Map(prev);
          });
          setRedoStack((prev) => {
            const newHistory = { action: "update", pathData: currentPath, type: "path" };
            return [...prev, newHistory as History];
          });
          updatePath(path.id, path);
          break;
        }
        case "delete": {
          const path = history.pathData;
          if (!path) return;
          path.setAttrs({ deleted: false });
          setPaths((prev) => {
            prev.set(path.id, path);
            return new Map(prev);
          });
          setRedoStack((prev) => {
            const newHistory = { action: "delete", pathData: path, type: "path" };
            return [...prev, newHistory as History];
          });
          updatePath(path.id, path);
          break;
        }
      }
    }
  }, [setNodes, addNode, addPath, updateNode, updatePath, nodes, undoStack, setRedoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) {
      console.log("redoStack is empty");
      return;
    }
    const history = redoStack.pop();
    if (!history) return;
    if (history.type === "node") {
      switch (history.action) {
        case "add": {
          const node = history.nodeData;
          if (!node) return;
          node.setAttrs({ deleted: false });
          console.log("redo add", node);
          setNodes((prev) => {
            prev.set(node.id, node);
            return new Map(prev);
          });
          setUndoStack((prev) => {
            const newHistory = { action: "add", nodeData: node, type: "node" };
            return [...prev, newHistory as History];
          });
          updateNode(node.id, node);
          break;
        }
        case "update": {
          const node = history.nodeData;
          if (!node) return;
          console.log("redo update", node);
          const currentNode = nodes.get(node.id);
          setNodes((prev) => {
            const updatedNode = new Node().setAttrs({ ...node });
            prev.set(node.id, updatedNode);
            return new Map(prev);
          });
          setUndoStack((prev) => {
            const newHistory = { action: "update", nodeData: currentNode, type: "node" };
            return [...prev, newHistory as History];
          });
          updateNode(node.id, node);
          break;
        }
        case "delete": {
          const node = history.nodeData;
          if (!node) return;
          node.setAttrs({ deleted: true });
          setNodes((prev) => {
            prev.set(node.id, node);
            return new Map(prev);
          });
          setUndoStack((prev) => {
            const newHistory = { action: "delete", nodeData: node, type: "node" };
            return [...prev, newHistory as History];
          });
          updateNode(node.id, node);
          break;
        }
      }
    } else {
      switch (history.action) {
        case "add": {
          const path = history.pathData;
          if (!path) return;
          path.setAttrs({ deleted: false });
          setPaths((prev) => {
            prev.set(path.id, path);
            return new Map(prev);
          });
          setUndoStack((prev) => {
            const newHistory = { action: "add", pathData: path, type: "path" };
            return [...prev, newHistory as History];
          });
          updatePath(path.id, path);
          break;
        }
        case "update": {
          const path = history.pathData;
          if (!path) return;
          console.log("redo update", path);
          const currentPath = paths.get(path.id);
          setPaths((prev) => {
            const updatedPath = new Path().setAttrs({ ...path });
            prev.set(path.id, updatedPath);
            return new Map(prev);
          });
          setUndoStack((prev) => {
            const newHistory = { action: "update", pathData: currentPath, type: "path" };
            return [...prev, newHistory as History];
          });
          updatePath(path.id, path);
          break;
        }
        case "delete": {
          const path = history.pathData;
          if (!path) return;
          path.setAttrs({ deleted: true });
          setPaths((prev) => {
            prev.set(path.id, path);
            return new Map(prev);
          });
          setUndoStack((prev) => {
            const newHistory = { action: "delete", pathData: path, type: "path" };
            return [...prev, newHistory as History];
          });
          updatePath(path.id, path);
          break;
        }
      }
    }
  }, [setNodes, addNode, addPath, updateNode, updatePath, nodes, redoStack, setUndoStack]);

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

  return { handleUndo, handleRedo, undoByShortCutKey, redoByShortCutKey };
};

export default useHistory;
