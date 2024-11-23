import { motion } from "framer-motion";
import { useContext } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import { useGetUsersBoard, useLoggedInUser } from "@/lib/services/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useUpdateUserBoardPermission } from "@/lib/services/mutations";

type Permission = "VIEW" | "EDIT" | "OWNER";

const BoardMembers = () => {
  const { boardId, boardOwner } = useContext(BoardContext);
  const { data: usersBoard } = useGetUsersBoard(boardId!);
  const queryClient = useQueryClient();
  const { data: loggedInUser } = useLoggedInUser();
  const updateUserBoardPermission = useUpdateUserBoardPermission();

  const handlePermissionChange = (userId: number, newPermission: Permission) => {
    updateUserBoardPermission.mutate({
      boardId: boardId!,
      userId: userId,
      permission: newPermission,
    });
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 100, duration: 0.3 }}
      className="absolute z-10 top-16 right-2 bg-white rounded-lg shadow-lg border border-gray-200 w-80"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Board Members</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {usersBoard?.length} {usersBoard?.length === 1 ? "member" : "members"}
        </p>
      </div>

      <ScrollArea className="h-72">
        <div className="p-2 space-y-1">
          {usersBoard?.map((userBoard) => (
            <div
              key={userBoard.user.id}
              className="group relative hover:bg-gray-50 rounded-lg p-3 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage src={userBoard.user.avatar} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                    {getInitials(userBoard.user.username)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userBoard.user.username}
                    </p>
                    {userBoard.user.id === boardOwner?.id && (
                      <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{userBoard.user.email.toLowerCase()}</p>
                </div>

                {loggedInUser?.id === boardOwner?.id && userBoard.user.id !== boardOwner?.id && (
                  <Select
                    defaultValue={userBoard.permission}
                    onValueChange={(value) =>
                      handlePermissionChange(userBoard.user.id, value as Permission)
                    }
                  >
                    <SelectTrigger className="h-8 w-24 text-xs bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEW" className="text-sm">
                        View
                      </SelectItem>
                      <SelectItem value="EDIT" className="text-sm">
                        Edit
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default BoardMembers;
