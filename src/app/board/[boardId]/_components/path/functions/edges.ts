// import { Path, PathEdge, PathPoint } from "../../../_contexts/boardContext";

// export function getControlPointCoords(points: PathPoint[], edge: PathEdge) {
//   const affectedPoints = edge.points.map((i) => points[i]);
//   const otherAxis = edge.axis === "y" ? "x" : "y";
//   return {
//     [otherAxis]:
//       affectedPoints[0][otherAxis] +
//       (affectedPoints[1][otherAxis] - affectedPoints[0][otherAxis]) / 2,
//     [edge.axis]: affectedPoints[0][edge.axis as "x" | "y"],
//   };
// }

// export function getControlPointAxis(point1: PathPoint, point2: PathPoint) {
//   if (point1.y === point2.y && point1.x !== point2.x) {
//     return "y";
//   }
//   return "x";
// }

// function calculateExtrudableEdges(points: PathPoint[]) {
//   const endPoints = [points.length - 2, points.length - 1];
//   return [
//     new PathEdge().setAttrs({
//       axis: getControlPointAxis(points[0], points[1]),
//       points: [0, 1],
//     }),
//     new PathEdge().setAttrs({
//       axis: getControlPointAxis(points[endPoints[0]], points[endPoints[1]]),
//       points: endPoints,
//     }),
//   ];
// }

// function calculateDraggableEdges(points: PathPoint[]) {
//   return points.reduce<PathEdge[]>((edges, point, index) => {
//     if (index === 0 || index === points.length - 1 || index + 1 === points.length - 1) {
//       return edges;
//     }
//     const nextIndex = index + 1;
//     edges.push(
//       new PathEdge().setAttrs({
//         axis: getControlPointAxis(points[index], points[nextIndex]),
//         points: [index, nextIndex],
//       })
//     );
//     return edges;
//   }, []);
// }

// export function calculateEdges(path: Path, activeDrag: { extruded: boolean } | null = null): Path {
//   const extrudableEdges = calculateExtrudableEdges(path.points);
//   const edges = calculateDraggableEdges(path.points);
//   return new Path().setAttrs({
//     ...path,
//     dragging: null,
//     edges,
//     extrudableEdges,
//     activeDrag,
//   });
// }

import { Vector2d } from "konva/lib/types";
import { Path, PathEdge, PathPoint } from "../../../_contexts/boardContext";

export function getControlPointCoords(points: PathPoint[], edge: PathEdge) {
  const affectedPoints = edge.points.map((i) => points[i]);
  const otherAxis = edge.axis === "y" ? "x" : "y";

  return {
    [otherAxis]:
      affectedPoints[0][otherAxis as keyof Vector2d] +
      (affectedPoints[1][otherAxis as keyof Vector2d] -
        affectedPoints[0][otherAxis as keyof Vector2d]) /
        2,
    [edge.axis]: affectedPoints[0][edge.axis as keyof Vector2d],
  };
}

export function getControlPointAxis(point1: PathPoint, point2: PathPoint): "x" | "y" {
  if (point1.y === point2.y && point1.x !== point2.x) {
    return "y";
  }
  return "x";
}

function calculateExtrudableEdges(points: PathPoint[]): PathEdge[] {
  const endPoints = [points.length - 2, points.length - 1];
  return [
    new PathEdge().setAttrs({
      axis: getControlPointAxis(points[0], points[1]),
      points: [0, 1],
    }),
    new PathEdge().setAttrs({
      axis: getControlPointAxis(points[endPoints[0]], points[endPoints[1]]),
      points: endPoints,
    }),
  ];
}

function calculateDraggableEdges(points: PathPoint[]): PathEdge[] {
  return points.reduce<PathEdge[]>((edges, point, index) => {
    if (index === 0 || index === points.length - 1 || index + 1 === points.length - 1) {
      return edges;
    }
    const nextIndex = index + 1;
    edges.push(
      new PathEdge().setAttrs({
        axis: getControlPointAxis(points[index], points[nextIndex]),
        points: [index, nextIndex],
      })
    );
    return edges;
  }, []);
}

export function calculateEdges(points: PathPoint[]): Path {
  const extrudableEdges = calculateExtrudableEdges(points);
  const edges = calculateDraggableEdges(points);
  return new Path().setAttrs({
    points,
    edges,
    extrudableEdges,
    activeDrag: { extruded: false },
    dragging: null,
  });
}
