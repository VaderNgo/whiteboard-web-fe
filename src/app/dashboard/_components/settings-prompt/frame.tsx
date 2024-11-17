"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CreditCard, User } from "lucide-react";
import { useState } from "react";
import { AccountSettings } from "./account";

const settingsMenus = [
  {
    name: "Account",
    icon: User,
    screen: AccountSettings,
  },
  {
    name: "Billing",
    icon: CreditCard,
    screen: () => <div>Billing Component</div>, // Placeholder component
  },
];

export const SettingsFrame = () => {
  const [currentScreen, setCurrentScreen] = useState("Account");

  const CurrentScreenComponent =
    settingsMenus.find((menu) => menu.name === currentScreen)?.screen || (() => null);

  return (
    <DialogContent className="flex flex-col h-[80%] min-w-[80%] lg:min-w-[50%]">
      <DialogHeader>
        <DialogTitle className="text-3xl">Settings</DialogTitle>
        <DialogDescription>Change your settings here</DialogDescription>
      </DialogHeader>

      <div className="flex gap-2 h-full">
        <div className="flex flex-col border-r border-black/10 h-full pr-2">
          {settingsMenus.map((menu) => (
            <Button
              variant="ghost"
              key={menu.name}
              onClick={() => setCurrentScreen(menu.name)}
              className={cn(
                "p-0 pr-8 pl-2 font-normal opacity-50 justify-start",
                currentScreen === menu.name && "opacity-100 font-medium"
              )}
            >
              <menu.icon className="h-5 w-5 mr-4" />
              <span>{menu.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex-1">
          <CurrentScreenComponent />
        </div>
      </div>
    </DialogContent>
  );
};
