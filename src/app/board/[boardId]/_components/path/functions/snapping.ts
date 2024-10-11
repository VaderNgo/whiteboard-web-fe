import { Vector2d } from "konva/lib/types";
import { Node, Path } from "../../../_contexts/boardContext";
import { updatePathFromTip } from "./paths";

const SNAP_THRESHOLD = 50;

interface SnapResult {
  shouldSnap: boolean;
  position?: Vector2d;
  nodeId?: string;
  anchorIndex?: number;
}

export function findNearestAnchorPoint(point: Vector2d, nodes: Map<string, Node>): SnapResult {
  let nearestDistance = SNAP_THRESHOLD;
  let result: SnapResult = { shouldSnap: false };
  //   console.log("-----------------");
  //   console.log("point: ", point);
  for (const [nodeId, node] of nodes.entries()) {
    console.log("node pos ", { x: node.x, y: node.y });
    for (const anchor of node.anchorPoints) {
      const anchorPos = {
        x: node.x + anchor.position.x,
        y: node.y + anchor.position.y,
      };
      const distance = Math.sqrt(
        Math.pow(point.x - anchorPos.x, 2) + Math.pow(point.y - anchorPos.y, 2)
      );
      //   console.log("index: ", anchor.indexAnchor, " pos:  ", anchorPos);
      //   console.log("index: ", anchor.indexAnchor, " = ", distance);
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
  console.log(result);

  return result;
}

export function updatePathAnchors(path: Path, nodes: Map<string, Node>) {
  const updatedPath = new Path().setAttrs({ ...path });
  const points = [...path.points];
  if (path.startAnchorPoint) {
    const node = nodes.get(path.startAnchorPoint.nodeId);
    if (node) {
      const anchor = node.anchorPoints[path.startAnchorPoint.indexAnchor];
      const tempData = points[0];
      points[0].setAttrs({
        ...tempData,
        x: anchor.position.x,
        y: anchor.position.y,
      });
    }
  }
  if (path.endAnchorPoint) {
    const node = nodes.get(path.endAnchorPoint.nodeId);
    if (node) {
      const anchor = node.anchorPoints[path.endAnchorPoint.indexAnchor];
      let tempData = points[points.length - 1];
      points[points.length - 1].setAttrs({
        ...tempData,
        x: anchor.position.x,
        y: anchor.position.y,
      });
    }
  }
  return updatedPath.setAttrs({
    points: points,
  });
}

export function handlePathEndpointDrag(
  path: Path,
  endpointIndex: number,
  position: Vector2d,
  nodes: Map<string, Node>
) {
  const snapResult = findNearestAnchorPoint(position, nodes);

  if (snapResult.shouldSnap && snapResult.position && snapResult.nodeId !== undefined) {
    // Update the path point position
    const updatedPath = updatePathFromTip(path, endpointIndex, snapResult.position);

    // Store the connection information
    if (endpointIndex === 0) {
      updatedPath.startAnchorPoint = {
        nodeId: snapResult.nodeId,
        indexAnchor: snapResult.anchorIndex!,
      };
    } else {
      updatedPath.endAnchorPoint = {
        nodeId: snapResult.nodeId,
        indexAnchor: snapResult.anchorIndex!,
      };
    }

    return updatedPath;
  }

  // If no snap, clear any existing connection and update position
  const updatedPath = updatePathFromTip(path, endpointIndex, position);
  if (endpointIndex === 0) {
    updatedPath.startAnchorPoint = null;
  } else {
    updatedPath.endAnchorPoint = null;
  }

  return updatedPath;
}
