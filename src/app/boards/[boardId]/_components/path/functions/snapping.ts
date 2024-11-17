import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { AnchorPoint, Node, Path, PathPoint } from "../../../_contexts/boardContext";
import { updatePathFromTip } from "./paths";

const SNAP_THRESHOLD = 10;

interface SnapResult {
  shouldSnap: boolean;
  position?: Vector2d;
  nodeId?: string;
  anchorIndex?: number;
}

export function findNearestAnchorPoint(point: Vector2d, nodes: Map<string, Node>): SnapResult {
  let nearestDistance = SNAP_THRESHOLD;
  let result: SnapResult = { shouldSnap: false };
  for (const [nodeId, node] of nodes.entries()) {
    for (const anchor of node.anchorPoints) {
      let anchorPos;
      if (node.shapeType !== "Rect") {
        anchorPos = {
          x: node.x + anchor.position.x,
          y: node.y + anchor.position.y,
        };
      } else {
        anchorPos = {
          x: node.x - node.width / 2 + anchor.position.x,
          y: node.y - node.height / 2 + anchor.position.y,
        };
      }
      if (!anchorPos) return result;
      const distance = Math.sqrt(
        Math.pow(point.x - anchorPos.x, 2) + Math.pow(point.y - anchorPos.y, 2)
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        result = {
          shouldSnap: true,
          position: anchorPos,
          nodeId: nodeId,
          anchorIndex: anchor.indexAnchor,
        };
      }
    }
  }
  return result;
}

function getAbsoluteAnchorPosition(node: Node, anchor: AnchorPoint): Vector2d {
  if (node.shapeType !== "Rect") {
    return {
      x: node.x + anchor.position.x,
      y: node.y + anchor.position.y,
    };
  } else {
    return {
      x: node.x - node.width / 2 + anchor.position.x,
      y: node.y - node.height / 2 + anchor.position.y,
    };
  }
}

export function updatePathAnchors(path: Path, nodes: Map<string, Node>) {
  const updatedPoints = [...path.points];

  if (path.startAnchorPoint) {
    const startNode = nodes.get(path.startAnchorPoint.nodeId);
    if (startNode) {
      const startAnchor = startNode.anchorPoints[path.startAnchorPoint.indexAnchor];
      const startPos = getAbsoluteAnchorPosition(startNode, startAnchor);
      updatedPoints[0] = new PathPoint().setAttrs({ ...path.points[0], ...startPos });
    }
  }

  if (path.endAnchorPoint) {
    const endNode = nodes.get(path.endAnchorPoint.nodeId);
    if (endNode) {
      const endAnchor = endNode.anchorPoints[path.endAnchorPoint.indexAnchor];
      const endPos = getAbsoluteAnchorPosition(endNode, endAnchor);
      updatedPoints[updatedPoints.length - 1] = new PathPoint().setAttrs({
        ...updatedPoints[updatedPoints.length - 1],
        ...endPos,
      });
    }
  }

  return new Path().setAttrs({ ...path, points: updatedPoints });
}

export function handlePathEndpointDrag(
  path: Path,
  endpointIndex: number,
  position: Vector2d,
  nodes: Map<string, Node>,
  e: Konva.KonvaEventObject<DragEvent>
) {
  const snapResult = findNearestAnchorPoint(position, nodes);

  if (snapResult.shouldSnap && snapResult.position && snapResult.nodeId !== undefined) {
    if (
      endpointIndex === 0 &&
      (!path.startAnchorPoint ||
        (path.startAnchorPoint.nodeId !== snapResult.nodeId &&
          path.startAnchorPoint.indexAnchor !== snapResult.anchorIndex))
    ) {
      path.setAttrs({
        startAnchorPoint: { nodeId: snapResult.nodeId, indexAnchor: snapResult.anchorIndex! },
      });
    }
    if (
      endpointIndex !== 0 &&
      (!path.endAnchorPoint ||
        (path.endAnchorPoint.nodeId !== snapResult.nodeId &&
          path.endAnchorPoint.indexAnchor !== snapResult.anchorIndex))
    ) {
      path.setAttrs({
        endAnchorPoint: { nodeId: snapResult.nodeId, indexAnchor: snapResult.anchorIndex! },
      });
    }
    e.target.setPosition(snapResult.position);
    return updatePathFromTip(path, endpointIndex, e.target.getPosition());
  }

  // If no snap, clear any existing connection and update position
  const updatedPath = updatePathFromTip(path, endpointIndex, e.target.getPosition());
  if (endpointIndex === 0 && updatedPath.startAnchorPoint) {
    updatedPath.setAttrs({ startAnchorPoint: null });
  } else if (endpointIndex !== 0 && updatedPath.endAnchorPoint) {
    updatedPath.setAttrs({ endAnchorPoint: null });
  }

  return updatedPath;
}

export function updatePathsForMovedNode(
  node: Node,
  paths: Map<string, Path>,
  nodes: Map<string, Node>
): Map<string, Path> {
  const updatedPaths = new Map(paths);

  updatedPaths.forEach((path, pathId) => {
    if (path.startAnchorPoint && path.startAnchorPoint.nodeId === node.id) {
      updatedPaths.set(
        pathId,
        updatePathFromTip(
          path,
          0,
          getAbsoluteAnchorPosition(node, node.anchorPoints[path.startAnchorPoint.indexAnchor])
        )
      );
    }
    if (path.endAnchorPoint && path.endAnchorPoint.nodeId === node.id) {
      updatedPaths.set(
        pathId,
        updatePathFromTip(
          path,
          path.points.length - 1,
          getAbsoluteAnchorPosition(node, node.anchorPoints[path.endAnchorPoint.indexAnchor])
        )
      );
    }
  });

  return updatedPaths;
}

export function updateSinglePath(path: Path, nodes: Map<string, Node>): Path {
  return updatePathAnchors(path, nodes);
}
