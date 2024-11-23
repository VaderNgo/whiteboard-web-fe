import { PermissionEditor } from "@/app/dashboard/[teamId]/_components/permission-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Permission } from "@/lib/permission-enum";
import { useRemoveMember } from "@/lib/services/mutations";
import { cn } from "@/lib/utils";
import { Crown, Trash2, UserX, XCircle } from "lucide-react";

type MemberProps = {
  teamId: string;
  avatarUrl: string;
  name: string;
  role?: string;
  email: string;
  permission?: Permission;
  className?: string;
  userId: string;
  showActions?: boolean;
  onMessage?: (message: string) => void;
  onError?: (message: string) => void;
};

export const Member = ({
  teamId,
  avatarUrl,
  name,
  role,
  permission,
  email,
  className,
  userId,
  showActions,
  onError,
  onMessage,
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
        <div className="w-full h-full flex flex-row space-x-2 items-center">
          <p className="font-semibold">{name}</p>
          {role == "OWNER" && <Crown size={15} fill="yellow" />}
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>

      {role !== "OWNER" && showActions && (
        <>
          <PermissionEditor
            teamId={teamId}
            userId={userId}
            currentPermission={permission!}
            onError={onError!}
            onSuccess={onMessage!}
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Trash2 size={20} stroke="red" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled={removeMember.isPending} onClick={handleRemoveMember}>
                <div className="flex gap-2 items-center text-red-500 font-bold cursor-pointer">
                  {role !== "PENDING" && (
                    <>
                      <UserX /> Are you sure to remove this member?
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
        </>
      )}
    </div>
  );
};
