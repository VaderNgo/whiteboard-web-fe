"use client";
import { Canvas } from "fabric";
import React, { createContext, ReactNode, useState } from "react";
interface CanvasContextType {
    canvas: Canvas | null;
    setCanvas: React.Dispatch<React.SetStateAction<Canvas | null>>;
}

export const CanvasContext = createContext<CanvasContextType>({
    canvas: null,
    setCanvas: () => {},
});

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    return <CanvasContext.Provider value={{ canvas, setCanvas }}>{children}</CanvasContext.Provider>;
};
