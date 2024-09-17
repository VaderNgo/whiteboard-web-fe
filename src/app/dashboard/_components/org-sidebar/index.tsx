"use client";
import { useLoggedInUser, useGetTeams, useGetTeamMembers } from "@/lib/services/queries";
import { Inbox, History, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { LeaveDialog } from "./leave-dialog";
import { MembersDialog } from "./members/members-dialog";
import { SettingsDialog } from "./settings-dialog";
import ParamNavButton from "./nav-btn";
import { DisbandDialog } from "./disband-dialog";

export const OrgSidebar = () => {
  const loggedInUser = useLoggedInUser();
  const { teamId } = useParams<{ teamId: string }>();

  const teams = useGetTeams();
  const teamMembers = useGetTeamMembers(teamId || "");

  const teamDetails = teamId
    ? teams.data?.find((team) => team.id.toString() === teamId)
    : undefined;
  const teamOwner = teamMembers?.data?.currentMembers.find((member) => member.role === "OWNER");

  return (
    <div className="hidden h-full lg:flex flex-col gap-y-2 w-52 bg-slate-100">
      <div className="flex items-center justify-center border-b w-full h-fit py-5">
        <h1 className="font-bold md:text-2xl font-mono xl pointer-events-none select-none text-center">
          Teamscribe
        </h1>
      </div>

      {!teamId ? (
        <div className="flex flex-col px-2 gap-1 w-full h-full items-center justify-start text-center font-semibold">
          <ParamNavButton icon={Inbox} text="Inbox" param="inbox" />
          <ParamNavButton icon={History} text="Recent" param="recent" />
          <ParamNavButton icon={Star} text="Starred" param="starred" />
        </div>
      ) : teamDetails ? (
        <div className="flex flex-col px-2 gap-1 w-full h-full items-center justify-start text-center font-semibold">
          <MembersDialog
            teamId={teamDetails.id}
            teamMembers={teamMembers.data}
            loggedInUser={loggedInUser.data}
            teamOwnerId={teamOwner?.id}
          />
          <SettingsDialog />

          {teamOwner?.id !== loggedInUser.data?.id && (
            <LeaveDialog teamId={teamDetails.id} userId={loggedInUser.data?.id.toString()} />
          )}

          {teamOwner?.id === loggedInUser.data?.id && <DisbandDialog teamId={teamDetails.id} />}
        </div>
      ) : null}
    </div>
  );
};
