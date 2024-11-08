import { Minus, Plus } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../../_contexts/boardContext";

const ZoomBar = () => {
  const { stageConfig, setStageConfig } = useContext(BoardContext);
  const handleZoom = (direction: string) => {
    setStageConfig((prev) => ({
      ...prev,
      stageScale:
        direction === "in"
          ? Math.min(prev.stageScale + 0.01, 1.9)
          : Math.max(prev.stageScale - 0.01, 0.1),
    }));
  };
  return (
    <div className="absolute z-10 bottom-2 right-2 bg-white rounded-e-md flex items-center shadow-md">
      <div className="w-full h-full flex flex-row bg-white-200 space-x-3 p-3 justify-center items-center">
        <button onClick={() => handleZoom("out")}>
          <Minus size={15} strokeWidth={3} />
        </button>
        <div className="min-w-14 flex justify-center">
          <span className="font-semibold">{(stageConfig.stageScale * 100).toFixed(0)}%</span>
        </div>
        <button onClick={() => handleZoom("in")}>
          <Plus size={15} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default ZoomBar;
