import {
    Circle,
    MessageSquareMore,
    MousePointer2,
    MoveUpRightIcon,
    PencilIcon,
    Redo2Icon,
    ShapesIcon,
    Square,
    StickyNoteIcon,
    Type,
    Undo2Icon,
} from "lucide-react";
import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState } from "../../_types/canvas";
import { LayerType } from "../../_types/layer";

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({ canvasState, setCanvasState, undo, redo, canRedo, canUndo }: ToolbarProps) => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rouned-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    onClick={() => setCanvasState({ mode: CanvasMode.None })}
                    isActive={[
                        CanvasMode.None,
                        CanvasMode.Translating,
                        CanvasMode.SelectionNet,
                        CanvasMode.Resizing,
                        CanvasMode.Pressing,
                    ].includes(canvasState.mode)}
                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text}
                />
                <ToolButton
                    label="Sticky Note"
                    icon={StickyNoteIcon}
                    onClick={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Note })}
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note}
                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Rectangle,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle
                    }
                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            layerType: LayerType.Ellipse,
                        })
                    }
                    isActive={canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse}
                />
                <ToolButton
                    label="Pen"
                    icon={PencilIcon}
                    onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
                <ToolButton label="Connection Line" icon={MoveUpRightIcon} onClick={() => {}} isActive={false} />
                <ToolButton label="Comment" icon={MessageSquareMore} onClick={() => {}} isActive={false} />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                <ToolButton label="Undo" icon={Undo2Icon} onClick={() => {}} isActive={false} />
                <ToolButton label="Redo" icon={Redo2Icon} onClick={() => {}} isActive={false} />
            </div>
        </div>
    );
};
