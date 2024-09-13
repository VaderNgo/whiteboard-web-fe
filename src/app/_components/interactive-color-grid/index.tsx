import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ColorBlock from "./color-block";

type Position = { x: number; y: number };

const GRID_SIZE = 40;
const NUM_SNAKES = 12;
const MOVE_INTERVAL = 100;
const TRAIL_LENGTH = 10;

const Snake: React.FC<{ initialPosition: Position }> = ({ initialPosition }) => {
  const [positions, setPositions] = useState<Position[]>([initialPosition]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPositions((prevPositions) => {
        const head = prevPositions[0];
        const newHead = getNextPosition(head);
        return [newHead, ...prevPositions.slice(0, TRAIL_LENGTH - 1)];
      });
    }, MOVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const getNextPosition = (currentPosition: Position): Position => {
    const directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    return {
      x: (currentPosition.x + randomDirection.x + GRID_SIZE) % GRID_SIZE,
      y: (currentPosition.y + randomDirection.y + GRID_SIZE) % GRID_SIZE,
    };
  };

  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          className="absolute bg-blue-500"
          style={{
            left: `${pos.x * 40}px`,
            top: `${pos.y * 40}px`,
            width: "40px",
            height: "40px",
            zIndex: 2,
            opacity: 1 - index / TRAIL_LENGTH, // For fading out the trail
          }}
        />
      ))}
    </>
  );
};

export default function InteractiveColorGrid({ className }: { className?: string }) {
  const [snakes, setSnakes] = useState<Position[]>([]);

  useEffect(() => {
    setSnakes(
      Array.from({ length: NUM_SNAKES }, () => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }))
    );
  }, []);

  return (
    <div className={cn("relative select-none", className)}>
      <div id="grid-mask" />
      <div id="color-grid">
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
          <ColorBlock key={index} />
        ))}
        {snakes.map((initialPosition, index) => (
          <Snake key={index} initialPosition={initialPosition} />
        ))}
      </div>
    </div>
  );
}
