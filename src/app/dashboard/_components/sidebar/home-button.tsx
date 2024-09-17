"use client";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import { useState } from "react";

export const HomeButton = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="aspect-square">
      <Hint label="Home" side="right" sideOffset={10}>
        <button
          onClick={() => setOpen(!isOpen)}
          className={cn(
            "bg-black/10 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 active:scale-90 transition-transform"
          )}
        >
          <Home className="text-black" />
        </button>
      </Hint>
    </div>
  );
};
