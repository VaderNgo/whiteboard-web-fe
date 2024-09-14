"use client";

import { useGetTeams, useLoggedInUser } from "@/lib/services/queries";
import { NewButton } from "./new-button";
import { Team } from "./team";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HomeButton } from "./home-button";
import { NotificationWrapper } from "@/components/notification-wrapper";
import { getPlanDetails } from "@/lib/utils";

export const SideBar = () => {
  const selectedTeamId = useParams<{ teamId: string }>().teamId;
  const userTeams = useGetTeams();
  const user = useLoggedInUser();

  const ownedTeams = userTeams.data?.filter((team) => team.role.toLowerCase() === "owner");
  const canCreateTeam =
    (ownedTeams?.length || 0) < (getPlanDetails(user.data?.accountPlan).maxOwnedTeams || 0);

  return (
    <aside className="absolute z-[1] left-0 top-0 bg-slate-100 border-r h-full w-[60px] flex p-3 flex-col gap-y-4">
      <Link href="/dashboard">
        <NotificationWrapper notifications={-1}>
          <HomeButton />
        </NotificationWrapper>
      </Link>

      {userTeams.data?.map((team) => (
        <div key={team.id}>
          <Link href={`/dashboard/${team.id}`}>
            <Team
              name={team.name}
              logo={team.logo}
              isSelected={team.id.toString() == selectedTeamId}
            />
          </Link>
        </div>
      ))}

      <NewButton
        disabled={!canCreateTeam}
        label={
          canCreateTeam
            ? "Create team"
            : "You have exceeded the maximum owned team for your plan. Please upgrade to create more teams."
        }
      />
    </aside>
  );
};
