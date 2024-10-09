import { Path } from "../../../_contexts/boardContext";
import { calculateEdges } from "./edges";

export function setActiveDrag(path: Path) {
  return new Path().setAttrs({
    ...path,
    id: path.id,
    activeDrag: {
      extruded: false,
    },
  });
}

export function clearActiveDrag(path: Path) {
  return calculateEdges(path);
}
