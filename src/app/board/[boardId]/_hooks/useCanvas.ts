import { useContext } from "react";
import { CanvasContext } from "../_contexts/canvasContext";
export const useCanvas = () => {
    return useContext(CanvasContext);
};
