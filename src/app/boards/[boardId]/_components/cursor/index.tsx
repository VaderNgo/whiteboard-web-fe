import React, { useContext } from "react";
import { Ellipse, Group, Line, Text } from "react-konva";
import { BoardContext } from "../../_contexts/boardContext";

type Props = {
  x: number;
  y: number;
  username: string | null;
  color: string;
  otherStagePosition?: { x: number; y: number };
  otherStageScale?: number;
};

const Cursor: React.FC<Props> = ({
  x,
  y,
  username,
  color,
  otherStagePosition = { x: 0, y: 0 },
  otherStageScale = 1,
}) => {
  const { stageConfig } = useContext(BoardContext);

  // Calculate absolute position without being affected by stage transforms
  const otherViewportX = (x - otherStagePosition.x) / otherStageScale;
  const otherViewportY = (y - otherStagePosition.y) / otherStageScale;

  // 2. Convert from their viewport coordinates to my stage coordinates
  const myX = otherViewportX * stageConfig.stageScale + stageConfig.stageX;
  const myY = otherViewportY * stageConfig.stageScale + stageConfig.stageY;

  // 3. Convert to my viewport coordinates for rendering
  const finalX = (myX - stageConfig.stageX) / stageConfig.stageScale;
  const finalY = (myY - stageConfig.stageY) / stageConfig.stageScale;
  return (
    <Group x={finalX} y={finalY}>
      {/* Cursor pointer shape */}
      <Line
        points={[0, 0, 10, 18, 14, 14, 18, 10, 0, 0]}
        fill={color || "#000000"}
        closed={true}
        stroke="white"
        strokeWidth={1}
      />

      {/* Username background */}
      <Group y={24}>
        <Line
          points={[0, 0, (username?.length || 8) * 8, 0, (username?.length || 8) * 8, 20, 0, 20]}
          closed={true}
          fill={color}
          cornerRadius={3}
        />

        {/* Username text */}
        <Text
          text={username || "Anonymous"}
          fill="white"
          fontSize={12}
          padding={6}
          align="center"
        />
      </Group>
    </Group>
  );
};

export default Cursor;
