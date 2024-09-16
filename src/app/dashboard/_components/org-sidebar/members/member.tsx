import { cn } from "@/lib/utils";
import { EllipsisVertical, Trash, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveMember } from "@/lib/services/mutations";

type MemberProps = {
  teamId: string;
  avatarUrl: string;
  name: string;
  role?: string;
  email: string;
  className?: string;
  userId: string;
  showActions?: boolean;
};

export const Member = ({
  teamId,
  avatarUrl,
  name,
  role,
  email,
  className,
  userId,
  showActions = true,
}: MemberProps) => {
  const removeMember = useRemoveMember();

  const handleRemoveMember = async () => {
    try {
      if (role !== "PENDING") await removeMember.mutateAsync({ teamId: teamId, memberId: userId });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cn("flex w-full gap-2 items-center", className)}>
      <img src={avatarUrl} className="rounded-full aspect-square object-cover h-full" />
      <div className="flex-1 flex flex-col">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <p className="text-sm text-muted-foreground">{role}</p>

      {role !== "OWNER" && showActions && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled={removeMember.isPending} onClick={handleRemoveMember}>
              <div className="flex gap-2 items-center text-red-500 font-bold cursor-pointer">
                {role !== "PENDING" && (
                  <>
                    <Trash /> Remove member
                  </>
                )}

                {role === "PENDING" && (
                  <>
                    <XCircle /> Cancel
                  </>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
