import { Minus, Plus } from "lucide-react";
import { useContext, useEffect } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import useSocket from "../../_hooks/useSocket";
import { useLoggedInUser } from "@/lib/services/queries";

const ZoomBar = () => {
  const { stageConfig, setStageConfig, presentation, isJoinedPresentation } =
    useContext(BoardContext);
  const { dragWhilePresenting } = useSocket();
  const { data: loggedUser } = useLoggedInUser();

  useEffect(() => {}, [stageConfig, presentation]);
  const handleZoom = (direction: string) => {
    dragWhilePresenting({
      ...stageConfig,
      stageScale:
        direction === "in"
          ? Math.min(stageConfig.stageScale + 0.01, 1.9)
          : Math.max(stageConfig.stageScale - 0.01, 0.1),
    });
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
          <span className="font-semibold">
            {(
              (isJoinedPresentation
                ? loggedUser!.id !== presentation?.presenter?.id
                  ? presentation!.presentation!.stageScale
                  : stageConfig.stageScale
                : stageConfig.stageScale) * 100
            ).toFixed(0)}
            %
          </span>
        </div>
        <button onClick={() => handleZoom("in")}>
          <Plus size={15} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default ZoomBar;
