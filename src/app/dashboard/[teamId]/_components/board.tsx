import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type BoardProps = {
  name?: string;
  logo?: string; // URL of the logo
  isFavorite?: boolean;
  onClick?: () => void;
};

export const Board = ({ name, logo, isFavorite = false, onClick }: BoardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative aspect-video w-full rounded-lg bg-muted/50 hover:bg-muted/70 transition overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        logo
          ? {
              backgroundImage: `url(${logo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
      <div className="relative p-4">
        <div className="flex items-center gap-x-2">
          <p className="text-white font-semibold">{name || "Board name"}</p>
          {isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
          {!isFavorite && isHovered && <Star className="h-4 w-4 text-white" />}
        </div>
      </div>
    </button>
  );
};
