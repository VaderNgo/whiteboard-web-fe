"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/lib/services/mutations";
import { useLoggedInUser } from "@/lib/services/queries";
import { Lock, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { SettingsFrame } from "../settings-prompt/frame";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

type UserAvatarProps = {
  className?: string;
};

export const UserAvatar = ({ className }: UserAvatarProps) => {
  const { data } = useLoggedInUser();
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img src={data?.avatar} className="h-8 w-8 rounded-md"></img>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>{data?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DialogTrigger>
          <SettingsFrame />
        </Dialog>
        <DropdownMenuItem className="cursor-not-allowed opacity-50">
          <Lock className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
