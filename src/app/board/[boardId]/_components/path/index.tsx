import { Path } from "react-konva";
import { BoardContext, Path as PathClass } from "../../_contexts/boardContext";
import { ControlPoints } from "./controlPoints";
import { getPathData, updatePathFromTip } from "./functions";
import { useContext, useEffect } from "react";
import { handlePathEndpointDrag, updatePathAnchors } from "./functions/snapping";
import { Vector2d } from "konva/lib/types";

interface EditablePathProps {
  initialPath: PathClass;
  onChange: (path: PathClass) => void;
}

export function EditablePath({ initialPath, onChange }: EditablePathProps) {
  const { nodes } = useContext(BoardContext);
  useEffect(() => {
    if (initialPath.startAnchorPoint || initialPath.endAnchorPoint) {
      const updatedPath = updatePathAnchors(initialPath, nodes);
      if (updatedPath !== initialPath) {
        onChange(updatedPath);
      }
    }
  }, [nodes, initialPath, onChange]);

  const handleControlPointDrag = (index: number, position: Vector2d) => {
    if (index === 0 || index === initialPath.points.length - 1) {
      const updatedPath = handlePathEndpointDrag(initialPath, index, position, nodes);
      onChange(updatedPath);
    } else {
      onChange(updatePathFromTip(initialPath, index, position));
    }
  };
  return (
    <>
      <Path
        data={getPathData(initialPath.points)}
        stroke={initialPath.strokeColor}
        strokeWidth={initialPath.strokeWidth}
      />
      <ControlPoints path={initialPath} onChange={onChange} />
    </>
  );
}
