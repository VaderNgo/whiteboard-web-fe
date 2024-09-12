"use client";

import { useGetTeams, useLoggedInUser } from "@/lib/services/queries";
import { NewButton } from "./new-button";
import { Team } from "./team";

export const SideBar = () => {
  const userTeams = useGetTeams();
  const user = useLoggedInUser();

  const ownedTeams = userTeams.data?.filter((team) => team.role.toLowerCase() === "owner");
  const canCreateTeam = (ownedTeams?.length || 0) < (user.data?.maxOwnedTeams || 0);

  return (
    <aside className="fixed z-[1] left-0 bg-blue-500 h-full w-[60px] flex p-3 flex-col gap-y-4">
      {userTeams.data?.map((team) => (
        <Team key={team.id} name={team.name} logo={team.logo} />
      ))}
      <NewButton
        disabled={!canCreateTeam}
        label={
          canCreateTeam
            ? "Create team"
            : "You have exceeded the maxmimum owned team for your plan. Please upgrade to create more teams."
        }
      />
    </aside>
  );
};
