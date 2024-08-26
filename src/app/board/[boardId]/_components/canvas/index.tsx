"use client";
import { useEffect, useRef } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import * as fabric from "fabric";

interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
            height: window.innerHeight,
            width: window.innerWidth,
            backgroundColor: "#fff",
        });
        return () => {
            canvas.dispose();
        };
    }, []);

    return (
        <main className="h-screen w-screen relative bg-neutral-100 touch-none">
            <div className="canvas-wrapper">
                <canvas ref={canvasRef} width={600} height={400} />
            </div>
            <Info />
            <Participants />
            <Toolbar />
        </main>
    );
};

export default Canvas;
