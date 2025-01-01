"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Board } from "./_components/board";
import { CreateBoardButton } from "./_components/create-board-btn";
import { useGetTeamBoards, useGetTeams, useLoggedInUser } from "@/lib/services/queries";
import { useDeleteBoard } from "@/lib/services/mutations";
import { PlanTag } from "@/components/plan-tag";
import { LoaderCircle, Trash2, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const getTeams = useGetTeams();
  const teamBoards = useGetTeamBoards(teamId);
  const deleteBoard = useDeleteBoard();
  const { data: currentUser } = useLoggedInUser();

  if (getTeams.isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const team = getTeams.data?.find((team) => team.id.toString() === teamId);
  if (!team) router.push("/dashboard");

  const handleBoardClick = (boardId: string) => {
    router.push(`/boards/${boardId}`);
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard.mutateAsync({ boardId });
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  };

  const activeBoards = teamBoards.data?.filter((board) => !board.isDeleted) || [];

  return (
    <div className="flex-1 h-full p-6">
      <div className="mb-6">
        <div className="flex items-center gap-x-4">
          <h1 className="text-3xl font-bold">{team?.name}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {team?.description || "No description provided"}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeBoards.map((board) => (
            <div key={board.id} className="relative group">
              <Board
                name={board.name}
                logo={board.logo}
                onClick={() => handleBoardClick(board.id)}
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={board.owner.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-white/80">{board.owner.username}</span>
              </div>
              {(board.owner.id === Number(currentUser?.id) || team!.role === "OWNER") && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 p-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity"
                    >
                      <Trash2 size={20} className=" text-red-400" strokeWidth={3} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Board</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this board? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBoard(board.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
          <CreateBoardButton label="Create Board" disabled={false} />
        </div>
      </div>
    </div>
  );
}
