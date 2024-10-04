import { use, useContext, useRef } from "react";
import { BoardContext, Path } from "../../_contexts/boardContext";
import Konva from "konva";

type EditablePathProps = {
  path: Path;
};

const EditablePath = ({ path }: EditablePathProps) => {
  const { paths, setPaths } = useContext(BoardContext);
  const pathRef = useRef<Konva.Group>(null);
};

export default EditablePath;
