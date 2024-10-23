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
  const { selectedPath, setSelectedPath, stageRef } = useContext(BoardContext);
  return (
    <>
      <Path
        data={getPathData(initialPath.points)}
        stroke={initialPath.strokeColor}
        strokeWidth={initialPath.strokeWidth}
        dash={initialPath.dash}
        onClick={() => setSelectedPath(initialPath)}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "pointer";
          }
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = "default";
          }
        }}
      />
      <ControlPoints path={initialPath} onChange={onChange} />
    </>
  );
}
