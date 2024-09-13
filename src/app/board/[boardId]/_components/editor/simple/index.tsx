import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { AlignCenter, Bold, Highlighter, Link, Square } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../../_contexts/boardContext";
import useHistory from "../../../_hooks/useHistory";
import useSocket from "../../../_hooks/useSocket";

const SimpleEditor = () => {
    const { selectedNode, editorValue, setEditorValue, stageRef, stageStyle, stageConfig, selectedShapes } =
        useContext(BoardContext);
    const { addToHistory } = useHistory();
    const { updateBoard } = useSocket();
    const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null);
    const [editorSize, setEditorSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedNode && stageRef && stageRef.current) {
            const stage = stageRef.current;
            const stageRect = stage.container().getBoundingClientRect();
            const groupRect = selectedShapes[0].getClientRect();

            setEditorPosition({
                left: groupRect.x + stageRect.left,
                top: groupRect.y + stageRect.top,
            });
        }

        if (editorRef) {
            setEditorSize({ w: editorRef.clientWidth, h: editorRef.clientHeight });
        }
    }, [selectedNode, stageRef, editorRef, stageConfig, stageStyle]);

    if (!selectedNode || !editorPosition) return null;

    let editorStyle: React.CSSProperties = {
        position: "absolute",
        left: `${editorPosition.left}px`,
        top: `${editorPosition.top}px`,
    };

    return (
        <div
            ref={setEditorRef}
            className={cn(
                "absolute hidden w-fit h-fit flex-row bg-white p-2 gap-5 items-center rounded-md top-10 left-10 caret-transparent select-none",
                selectedNode && "flex"
            )}
            style={editorStyle}
        >
            <Hint label="shape" side="bottom" sideOffset={10}>
                <div className="flex flex-row justify-center items-center cursor-pointer">
                    <Square />
                </div>
            </Hint>

            <Hint label="font" side="bottom" sideOffset={10}>
                <div className="flex flex-row justify-center items-center cursor-pointer">
                    <span>Font</span>
                </div>
            </Hint>

            <Hint label="font size" side="bottom" sideOffset={10}>
                <div className="flex flex-row justify-center items-center cursor-pointer">
                    <div className="flex flex-row bg-green-500">
                        <div className="">
                            <input defaultValue={12} type="number" min={1} className="w-[50px]" />
                        </div>
                        <div className="flex flex-col bg-red-50"></div>
                    </div>
                </div>
            </Hint>

            <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
                <Hint label="Bold" side="bottom" sideOffset={10}>
                    <Bold />
                </Hint>
                <Hint label="Align" side="bottom" sideOffset={10}>
                    <AlignCenter />
                </Hint>
                <Hint label="Insert Link" side="bottom" sideOffset={10}>
                    <Link />
                </Hint>
            </div>
            <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
                <Hint label="Text Color" side="bottom" sideOffset={10}>
                    <div className="flex flex-col h-full justify-center items-center">
                        <span className="font-bold text-black text-md">A</span>
                        <div className="w-[25px] h-[5px] bg-black mb-0"></div>
                    </div>
                </Hint>
                <Hint label="Highlighter Color" side="bottom" sideOffset={10}>
                    <div className="flex flex-col h-full justify-center items-center">
                        <Highlighter className="" />
                        <div className="w-[25px] h-[5px] bg-black bottom-0"></div>
                    </div>
                </Hint>
            </div>

            <div className="flex flex-row justify-center items-center cursor-pointer gap-5">
                <Hint label="Border Style, Opacity, Color">
                    <div className="flex flex-col justify-center items-center">
                        <div className="size-[25px] rounded-full bg-red-500 flex flex-row justify-center items-center caret-transparent">
                            <div className="size-[15px] rounded-full bg-white caret-transparent"></div>
                        </div>
                    </div>
                </Hint>
                <Hint side="bottom" sideOffset={10} label="Set color and opacity">
                    <div className="flex flex-col justify-center items-center">
                        <div className="size-[25px] rounded-full bg-yellow-400 flex flex-row justify-center items-center caret-transparent"></div>
                    </div>
                </Hint>
            </div>
        </div>
    );
};

export default SimpleEditor;