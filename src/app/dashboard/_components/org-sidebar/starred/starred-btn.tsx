"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export const StarredButton = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="w-full hover:bg-slate-200 bg-transparent px-2 border-none font-normal"
      onClick={() => router.push(pathname + "?view=starred")}
    >
      <div className="flex items-center w-full">
        <Star className="mr-2" size={25} />
        <p className="">Starred</p>
      </div>
    </Button>
  );
};
