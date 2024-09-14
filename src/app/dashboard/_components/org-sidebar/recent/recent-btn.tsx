"use client";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export const RecentButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="w-full hover:bg-slate-200 bg-transparent px-2 border-none font-normal"
      onClick={() => router.push(pathname + "?view=recent")}
    >
      <div className="flex items-center w-full">
        <History className="mr-2" size={25} />
        <p className="">Recent</p>
      </div>
    </Button>
  );
};
