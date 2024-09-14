"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

type BoardProps = {
  name?: string;
  isFavorite?: boolean;
};

export const Board = ({ name, isFavorite = false }: BoardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="w-64 h-32 bg-slate-100 rounded-md relative overflow-hidden cursor-pointer active:scale-90 transition-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute top-full left-0 bg-black/50 h-12 w-full py-2 px-3 font-mono font-semibold text-white transition-transform duration-200",
          isHovered && "-translate-y-12"
        )}
      >
        <div className="flex w-full h-full justify-center items-center">
          <p className="flex-1">{name || "Board name"}</p>
          {isFavorite && <Star fill={"orange"} color={"orange"} />}
          {!isFavorite && <Star />}
        </div>
      </div>
    </div>
  );
};
