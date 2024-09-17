import React from "react";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  icon: LucideIcon;
  text: string;
  param: string;
}

const ParamNavButton: React.FC<NavButtonProps> = ({ icon: Icon, text, param }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const isActive = view === param;

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full hover:bg-slate-200 bg-transparent px-2 border-none font-normal",
        isActive && "bg-slate-200"
      )}
      onClick={() => router.push(`${pathname}?view=${param}`)}
    >
      <div className="flex items-center w-full">
        <Icon className="mr-2" size={25} />
        <p className={cn(isActive && "font-semibold")}>{text}</p>
      </div>
    </Button>
  );
};

export default ParamNavButton;
