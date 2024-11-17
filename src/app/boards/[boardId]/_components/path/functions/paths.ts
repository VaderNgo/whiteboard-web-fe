import { Vector2d } from "konva/lib/types";
import { Path, PathEdge, PathPoint } from "../../../_contexts/boardContext";

export function updatePath(path: Path, edge: PathEdge, position: any) {
  const newPoints = path.points.map((item: any, index: any) => {
    if (edge.points.includes(index)) {
      return {
        ...item,
        [edge.axis]: position[edge.axis],
      };
    }
    return item;
  });
  return path.setAttrs({
    points: newPoints,
  });
}

export function getPathData(points: PathPoint[]) {
  return points.map((point) => `${point.command} ${point.x} ${point.y}`).join(" ");
}

export function updatePathFromExtrude(path: Path, edge: PathEdge, position: Vector2d) {
  // Create copies so can mutate them
  const newPoints = [...path.points];
  const newExtrudableEdges = [...path.extrudableEdges];
  const newActiveDrag = path.activeDrag;
  // Set up configuration, check if starting edge, get the axis to update and the other axis
  // with the node to base the other axis' value off
  const isStartEdge = edge.points[0] === 0;
  const axis = edge.axis;
  const otherAxis = edge.axis === "y" ? "x" : "y";
  const nodeToUpdate = isStartEdge ? 0 : 1;

  // update edge's axis with teh current position
  newPoints[edge.points[0]][axis as "x" | "y"] = position[axis as "x" | "y"];
  newPoints[edge.points[1]][axis as "x" | "y"] = position[axis as "x" | "y"];

  // Check if the extruded flag has been set, that means we should create the new edge to extrude
  if (!path.activeDrag || !path.activeDrag.extruded) {
    // Create the new edge using the current axis position and the other axis value from the next or previous point depending on
    // if the extruding edge is at the start or end
    const newCommand = new PathPoint().setAttrs({
      command: "L",
      [axis]: position[axis as "x" | "y"],
      [otherAxis]: newPoints[edge.points[nodeToUpdate]][otherAxis],
    });
    // Add that new line command into the array after the first line
    newPoints.splice(edge.points[1], 0, newCommand);
    // Set extruded to true so we don't create anymore new edges during the active drag
    newActiveDrag!.extruded = true;
    // Update the drag handles so UX wise it feels like we're extruding the edge although at this point
    // we're actually setting the coordinates on the new edge
    if (isStartEdge) {
      newExtrudableEdges[0].points = [1, 2];
      newExtrudableEdges[1].points = [newPoints.length - 2, newPoints.length - 1];
    } else {
      newExtrudableEdges[1].points = [newPoints.length - 3, newPoints.length - 2];
    }
  }
  return path.setAttrs({
    points: newPoints,
    extrudableEdges: newExtrudableEdges,
    activeDrag: newActiveDrag,
  });
}

export function updatePathFromTip(path: Path, index: number, position: Vector2d) {
  const newPoints = [...path.points];
  newPoints[index] = new PathPoint().setAttrs({
    ...newPoints[index],
    ...position,
  });

  const otherIndex = index === 0 ? 1 : index - 1;
  const axis = path.points[index].y === path.points[otherIndex].y ? "y" : "x";

  if (position[axis as keyof Vector2d] !== path.points[index][axis as keyof Vector2d]) {
    newPoints[otherIndex] = new PathPoint().setAttrs({
      ...newPoints[otherIndex],
      [axis]: position[axis as keyof Vector2d],
    });
  }

  return path.setAttrs({
    points: newPoints,
  });
}
