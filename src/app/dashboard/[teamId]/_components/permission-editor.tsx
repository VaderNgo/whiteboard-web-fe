import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Permission } from "@/lib/permission-enum";
import { useUpdatePermission } from "@/lib/services/mutations";
import { AxiosError } from "axios";
import { useGetTeamMembers } from "@/lib/services/queries";

const PERMISSIONS = [
  { label: "VIEW", value: Permission.VIEW },
  { label: "EDIT", value: Permission.EDIT },
] as const;

export const PermissionEditor = ({
  teamId,
  userId,
  currentPermission,
  onError,
  onSuccess,
}: {
  teamId: string;
  userId: string;
  currentPermission: Permission;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Permission>(currentPermission);
  const updatePermission = useUpdatePermission();
  const currentLabel = PERMISSIONS.find((p) => p.value === value)?.label;

  const handlePermissionChange = async (newPermission: Permission) => {
    try {
      await updatePermission.mutateAsync({
        teamId,
        userId: userId,
        permission: newPermission,
      });
      setValue(newPermission);
      setOpen(false);
      onSuccess(`Successfully updated member's permission to ${newPermission}`);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 403) {
        onError("You don't have permission to update member permissions");
      } else if (error.response?.status === 404) {
        onError("Member not found");
      } else {
        onError("Failed to update member's permission");
      }
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between text-xs"
          disabled={updatePermission.isPending}
        >
          {updatePermission.isPending ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            <>
              {currentLabel}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[120px]">
        {PERMISSIONS.map((permission) => (
          <DropdownMenuItem
            key={permission.value}
            onClick={() => handlePermissionChange(permission.value)}
            className={cn(
              "flex items-center justify-between",
              value === permission.value && "bg-accent"
            )}
          >
            <span>{permission.label}</span>
            {value === permission.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
