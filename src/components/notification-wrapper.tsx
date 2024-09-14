"use client";
import { ReactNode } from "react";

export const NotificationWrapper = ({
  notifications,
  children,
}: {
  notifications?: number;
  children: ReactNode;
}) => {
  return (
    <div className="relative">
      {children}
      {notifications && notifications > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {notifications}
        </div>
      )}
    </div>
  );
};
