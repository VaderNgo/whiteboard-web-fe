"use client";
import { useParams, useRouter } from "next/navigation";
import { Board } from "./_components/board";
import { CreateBoardButton } from "./_components/create-board-btn";
import { useGetTeamBoards, useGetTeams } from "@/lib/services/queries";
import { PlanTag } from "@/components/plan-tag";
import { LoaderCircle } from "lucide-react";

export default function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const getTeams = useGetTeams();
  const teamBoards = useGetTeamBoards(teamId);
  if (getTeams.isLoading)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <LoaderCircle className="animate-spin text-black opacity-50" size={64} />
      </div>
    );

  const team = getTeams.data?.find((team) => team.id.toString() === teamId);
  if (!team) router.push("/dashboard");

  const handleBoardClick = (boardId: string) => {
    router.push(`/boards/${boardId}`);
  };

  return (
    <div className="w-full h-screen p-5 flex flex-col gap-5">
      <div className="flex gap-5">
        <img src={team?.logo} className="w-32 h-32 rounded-md"></img>
        <div>
          <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold font-mono">{team?.name}</h1>
            <PlanTag plan={team?.plan || "FREE"} />
          </div>
          <p className="text-gray-500 font-mono">
            {team?.description || "No description provided"}
          </p>
        </div>
      </div>
      <h2 className="border-b w-full pb-1 font-semibold text-lg font-mono">Boards</h2>

      {/* Grid display */}
      <div className="flex flex-wrap gap-5 items-center justify-center">
        {teamBoards.data?.map((board, index) => (
          <div key={index} onClick={() => handleBoardClick(board.id)}>
            <Board key={index} name={board.name} />
          </div>
        ))}
        <CreateBoardButton disabled={false} label="Add board" />
      </div>
    </div>
  );
}
