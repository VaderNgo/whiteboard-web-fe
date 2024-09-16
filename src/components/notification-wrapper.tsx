"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const NotificationWrapper = ({
  notifications,
  children,
  className,
}: {
  notifications?: number;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {notifications && notifications > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {notifications}
        </div>
      )}
    </div>
  );
};
