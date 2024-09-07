import { cn } from "@/lib/utils";
import ColorBlock from "./color-block";

type ColorBlockProps = {
  className?: string;
};

export default function InteractiveColorGrid({ className }: ColorBlockProps) {
  return (
    <div className={cn("relative", className)}>
      <div id="grid-mask" />
      <div id="color-grid">
        {[...Array(40 * 40)].map((_, index) => (
          <ColorBlock key={index} />
        ))}
      </div>
    </div>
  );
}
