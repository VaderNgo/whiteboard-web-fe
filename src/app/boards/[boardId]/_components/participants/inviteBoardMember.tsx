import React, { useContext, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BoardContext } from "../../_contexts/boardContext";
import { useGetTeamMembers, useLoggedInUser } from "@/lib/services/queries";
import { useInviteMemberToBoard } from "@/lib/services/mutations";
import { Permission } from "@/lib/permission-enum";

const InviteBoardMember = () => {
  const [open, setOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission>(Permission.VIEW);
  const { boardId, usersBoard, teamId, boardOwner } = useContext(BoardContext);
  const { data: teamMembersData } = useGetTeamMembers(teamId);
  const { mutateAsync: addMember, isSuccess } = useInviteMemberToBoard();
  const { data: loggedInUser } = useLoggedInUser();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const isOwner = loggedInUser?.id === boardOwner?.id;

  if (!isOwner) return null;

  const nonBoardMembers = teamMembersData?.currentMembers.filter(
    (member) =>
      ![...(usersBoard?.values() ?? [])].some((userBoard) => userBoard.user.id === member.id)
  );

  const handleAdd = async (userId: number) => {
    setIsAddingMember(true);
    try {
      await addMember({
        boardId: boardId!,
        userId,
        permission: selectedPermission,
      });
      setOpen(false);
    } finally {
      setIsAddingMember(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Members</DialogTitle>
          </DialogHeader>

          <div className="flex items-center mb-4">
            <span className="text-sm mr-2">Default Permission:</span>
            <Select
              value={selectedPermission}
              onValueChange={(value) => setSelectedPermission(value as Permission)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW">View</SelectItem>
                <SelectItem value="EDIT">Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {nonBoardMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleAdd(member.id)} disabled={isAddingMember}>
                  {isAddingMember ? "Adding..." : "Add"}
                </Button>
              </div>
            ))}
            {nonBoardMembers?.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                All team members are already in this board
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteBoardMember;
