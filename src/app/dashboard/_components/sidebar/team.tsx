import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";

type TeamProps = {
  name: string;
  logo: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export const Team = ({ name, logo: icon, onClick, isSelected }: TeamProps) => {
  return (
    <Hint label={name} align="start" side="right" sideOffset={10}>
      <div
        className={cn(
          "cursor-pointer aspect-square opacity-50 hover:opacity-100 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] active:scale-90 transition-transform",
          isSelected && "opacity-100"
        )}
        onClick={onClick}
      >
        <img src={icon} alt={name} className="w-full h-full rounded-md object-cover" />
      </div>
    </Hint>
  );
};
