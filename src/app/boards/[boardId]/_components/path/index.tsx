import { useContext } from "react";
import { Path } from "react-konva";
import { BoardContext, Path as PathClass } from "../../_contexts/boardContext";
import { ControlPoints } from "./controlPoints";
import { getPathData } from "./functions";

interface EditablePathProps {
  initialPath: PathClass;
  onChange: (path: PathClass) => void;
}

export function EditablePath({ initialPath, onChange }: EditablePathProps) {
  const { selectedPath, setSelectedPath, stageRef, setSelectedNode } = useContext(BoardContext);
  return (
    <>
      <Path
        data={getPathData(initialPath.points)}
        stroke={initialPath.strokeColor}
        strokeWidth={initialPath.strokeWidth}
        dash={initialPath.dash}
        onClick={() => {
          setSelectedPath(initialPath);
          setSelectedNode(null);
        }}
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
