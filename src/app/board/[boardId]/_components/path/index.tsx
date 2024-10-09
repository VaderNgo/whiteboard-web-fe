import { Path } from "react-konva";
import { Path as PathClass } from "../../_contexts/boardContext";
import { ControlPoints } from "./controlPoints";
import { getPathData } from "./functions";

interface EditablePathProps {
  initialPath: PathClass;
  onChange: (path: PathClass) => void;
}

export function EditablePath({ initialPath, onChange }: EditablePathProps) {
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
