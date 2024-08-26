import {
    MessageSquareMore,
    MousePointer2,
    MoveUpRightIcon,
    PencilIcon,
    Redo2Icon,
    ShapesIcon,
    StickyNoteIcon,
    Type,
    Undo2Icon,
} from "lucide-react";
import { ToolButton } from "./tool-button";

export const Toolbar = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white rouned-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton label="Select" icon={MousePointer2} onClick={() => {}} isActive={false} />
                <ToolButton label="Text" icon={Type} onClick={() => {}} isActive={false} />
                <ToolButton label="Sticky Note" icon={StickyNoteIcon} onClick={() => {}} isActive={false} />
                <ToolButton label="Shape" icon={ShapesIcon} onClick={() => {}} isActive={false} />
                <ToolButton label="Connection Line" icon={MoveUpRightIcon} onClick={() => {}} isActive={false} />
                <ToolButton label="Pen" icon={PencilIcon} onClick={() => {}} isActive={false} />
                <ToolButton label="Comment" icon={MessageSquareMore} onClick={() => {}} isActive={false} />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                <ToolButton label="Undo" icon={Undo2Icon} onClick={() => {}} isActive={false} />
                <ToolButton label="Redo" icon={Redo2Icon} onClick={() => {}} isActive={false} />
            </div>
        </div>
    );
};
