"use client";
import { useEffect, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { CanvasMode, CanvasState } from "../../_types/canvas";
import { Info } from "../info";
import { Participants } from "../participants";
import { Toolbar } from "../toolbar";

interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (dimensions.width === 0 || dimensions.height === 0) {
        return null;
    }

    return (
        <main className="h-screen w-screen relative bg-neutral-100 touch-none">
            <Stage width={dimensions.width} height={dimensions.height} className="bg-white">
                <Layer>
                    <Rect draggable width={100} height={200} fill={"red"} />
                </Layer>
            </Stage>
            <Info />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={false}
                canUndo={false}
                undo={() => {}}
                redo={() => {}}
            />
        </main>
    );
};

export default Canvas;
