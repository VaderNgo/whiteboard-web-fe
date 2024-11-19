import React, { useContext, useEffect, useState, useCallback } from "react";
import { Layer, Line } from "react-konva";
import { BoardContext } from "../../../_contexts/boardContext";

interface GridLayerProps {
  baseGridSize?: number;
  gridLevels?: number;
  gridOutsizePercentage?: number;
}

const GridLayer: React.FC<GridLayerProps> = ({
  baseGridSize = 100,
  gridLevels = 3,
  gridOutsizePercentage = 0.2,
}) => {
  const { stageRef, stageConfig } = useContext(BoardContext);
  const [lines, setLines] = useState<JSX.Element[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize updateGrid to prevent recreation
  const updateGrid = useCallback(() => {
    if (!stageRef?.current) {
      return;
    }

    const stage = stageRef.current;
    const scale = Math.max(stage.scaleX(), stage.scaleY());

    // Calculate the visible area
    const transform = stage.getAbsoluteTransform().copy().invert();
    const topLeftCorner = transform.point({ x: 0, y: 0 });

    const currentLevel = calculateGridLevel(scale);
    const allLines: JSX.Element[] = [];

    // Generate multiple grid levels
    for (let levelOffset = -1; levelOffset <= 1; levelOffset++) {
      const level = currentLevel + levelOffset;
      const gridSize = getGridSizeForLevel(level, scale);
      const opacity = getOpacityForLevel(level, scale);

      const points = calculatePoints(topLeftCorner, gridSize);
      const gridLines = createGridLines(gridSize, opacity, points);
      allLines.push(...gridLines);
    }

    setLines(allLines);
  }, [stageRef?.current, baseGridSize]);

  // Initial mount effect with RAF loop
  useEffect(() => {
    let rafId: number;
    let attempts = 0;
    const maxAttempts = 10;

    const tryInitialize = () => {
      if (!stageRef?.current || attempts >= maxAttempts) return;

      const stage = stageRef.current;
      if (stage.width() && stage.height()) {
        updateGrid();
        setIsInitialized(true);
      } else {
        attempts++;
        rafId = requestAnimationFrame(tryInitialize);
      }
    };

    tryInitialize();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stageRef?.current, updateGrid]);

  // Set up event listeners after initialization
  useEffect(() => {
    if (!isInitialized || !stageRef?.current) return;

    const stage = stageRef.current;

    // Create a debounced update function
    let dragTimeout: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(dragTimeout);
      dragTimeout = setTimeout(() => {
        updateGrid();
      }, 16); // Approximately one frame at 60fps
    };

    // Handle drag events
    const handleDrag = () => {
      debouncedUpdate();
    };

    // Handle scale events
    const handleScale = () => {
      updateGrid();
    };

    // Add event listeners
    stage.on("dragmove", handleDrag);
    stage.on("scale", handleScale);
    stage.on("scaleend", handleScale);

    // Force initial update
    updateGrid();

    return () => {
      clearTimeout(dragTimeout);
      if (stage) {
        stage.off("dragmove", handleDrag);
        stage.off("scale", handleScale);
        stage.off("scaleend", handleScale);
      }
    };
  }, [isInitialized, stageRef?.current, updateGrid]);

  // Update when stage config changes
  useEffect(() => {
    if (stageConfig && isInitialized) {
      updateGrid();
    }
  }, [stageConfig, updateGrid, isInitialized]);

  const calculateGridLevel = (scale: number): number => {
    const logScale = Math.log2(scale);
    return Math.floor(logScale);
  };

  const getGridSizeForLevel = (level: number, scale: number): number => {
    const adjustedBaseSize = baseGridSize * Math.pow(2, level);
    return adjustedBaseSize / scale;
  };

  const getOpacityForLevel = (level: number, scale: number): number => {
    const baseOpacity = 0.3;
    const scaleLog = Math.log2(scale);
    const fractionalPart = scaleLog - Math.floor(scaleLog);

    // Fade between levels
    if (fractionalPart > 0.7) return baseOpacity * (1 - (fractionalPart - 0.7) / 0.3);
    if (fractionalPart < 0.3) return baseOpacity * (fractionalPart / 0.3);
    return baseOpacity;
  };

  const calculatePoints = (corner: { x: number; y: number }, gridSize: number) => {
    if (!stageRef?.current) return { startX: 0, endX: 0, startY: 0, endY: 0 };
    const stage = stageRef.current;

    // Add extra padding to ensure grid covers the entire visible area
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
