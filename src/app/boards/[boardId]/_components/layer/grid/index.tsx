import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Layer, Line } from "react-konva";
import { BoardContext } from "../../../_contexts/boardContext";

interface GridLayerProps {
  baseGridSize?: number;
}

const GridLayer: React.FC<GridLayerProps> = ({ baseGridSize = 100 }) => {
  const { stageRef, stageConfig, presentation } = useContext(BoardContext);
  const [lines, setLines] = useState<JSX.Element[]>([]);

  const updateGrid = useCallback(() => {
    if (!stageRef?.current) return;

    const stage = stageRef.current;
    const scale = Math.max(stage.scaleX(), stage.scaleY());

    // Force scale to 1 if it's close to 1 on first render
    const safeScale = Math.abs(scale - 1) < 0.01 ? 1 : scale;

    const transform = stage.getAbsoluteTransform().copy().invert();
    const topLeftCorner = transform.point({ x: 0, y: 0 });

    const currentLevel = calculateGridLevel(safeScale);
    const allLines: JSX.Element[] = [];

    // Generate multiple grid levels
    for (let levelOffset = -1; levelOffset <= 1; levelOffset++) {
      const level = currentLevel + levelOffset;
      const gridSize = getGridSizeForLevel(level, safeScale);
      const opacity = getOpacityForLevel(level, safeScale);

      const points = calculatePoints(topLeftCorner, gridSize);
      const gridLines = createGridLines(gridSize, opacity, points);
      allLines.push(...gridLines);
    }

    setLines(allLines);
  }, [stageRef?.current, baseGridSize]);

  // Trigger grid update on multiple events
  useEffect(() => {
    if (!stageRef?.current) return;

    // Immediate update
    const initialUpdateTimeout = setTimeout(updateGrid, 0);

    // Additional update after a short delay to handle potential async rendering
    const delayedUpdateTimeout = setTimeout(updateGrid, 100);

    return () => {
      clearTimeout(initialUpdateTimeout);
      clearTimeout(delayedUpdateTimeout);
    };
  }, [stageRef?.current, updateGrid, stageConfig, presentation]);

  const calculateGridLevel = (scale: number): number => {
    const adjustedScale = Math.max(Math.min(scale, 1.9), 0.2);
    return Math.floor(Math.log2(adjustedScale));
  };

  const getGridSizeForLevel = (level: number, scale: number): number => {
    const adjustedBaseSize = baseGridSize * Math.pow(2, level);
    return adjustedBaseSize / scale;
  };

  const getOpacityForLevel = (level: number, scale: number): number => {
    const baseOpacity = 0.3;
    const scaleLog = Math.log2(Math.max(Math.min(scale, 1.9), 0.2));
    const fractionalPart = scaleLog - Math.floor(scaleLog);

    // Ensure some opacity at scale 1
    if (Math.abs(scale - 1) < 0.01) return baseOpacity;

    if (fractionalPart > 0.7) return baseOpacity * (1 - (fractionalPart - 0.7) / 0.3);
    if (fractionalPart < 0.3) return baseOpacity * (fractionalPart / 0.3);
    return baseOpacity;
  };

  const calculatePoints = (corner: { x: number; y: number }, gridSize: number) => {
    if (!stageRef?.current) return { startX: 0, endX: 0, startY: 0, endY: 0 };
    const stage = stageRef.current;

    const padding = gridSize * 3;

    const startX = Math.floor(corner.x / gridSize) * gridSize - padding;
    const endX = startX + stage.width() / stage.scaleX() + padding * 2;

    const startY = Math.floor(corner.y / gridSize) * gridSize - padding;
    const endY = startY + stage.height() / stage.scaleY() + padding * 2;

    return { startX, endX, startY, endY };
  };

  const createGridLines = (
    gridSize: number,
    opacity: number,
    points: { startX: number; endX: number; startY: number; endY: number }
  ): JSX.Element[] => {
    const lines: JSX.Element[] = [];
    const { startX, endX, startY, endY } = points;

    // Horizontal lines
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push(
        <Line
          key={`grid-h-${x}-${gridSize}`}
          points={[x, startY, x, endY]}
          stroke="#000"
          strokeWidth={gridSize > baseGridSize ? 1 : 0.5}
          opacity={opacity}
          listening={false}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
          transformsEnabled="position"
        />
      );
    }

    // Vertical lines
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push(
        <Line
          key={`grid-v-${y}-${gridSize}`}
          points={[startX, y, endX, y]}
          stroke="#000"
          strokeWidth={gridSize > baseGridSize ? 1 : 0.5}
          opacity={opacity}
          listening={false}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
          transformsEnabled="position"
        />
      );
    }

    return lines;
  };

  return <Layer listening={false}>{lines}</Layer>;
};

export default GridLayer;
