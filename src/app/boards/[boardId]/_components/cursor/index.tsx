import React, { useContext } from "react";
import { Circle, Group, Text } from "react-konva";
import { BoardContext } from "../../_contexts/boardContext";

type Props = {
  x: number;
  y: number;
  username: string | null;
  color: string;
};

const Cursor: React.FC<Props> = ({ x, y, username, color }) => {
  const { dark } = useContext(BoardContext);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M0 0 L10 18 L14 14 L18 10 Z"
          fill={color || "#000000"}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <div
        style={{
          background: color,
          color: "white",
          padding: "2px 6px",
          borderRadius: "3px",
          fontSize: "12px",
          marginTop: "4px",
          whiteSpace: "nowrap",
        }}
      >
        {username || "Anonymous"}
      </div>
    </div>
  );
};

export default Cursor;
