"use client";

import { useGetTeams } from "@/lib/services/queries";
import { useParams } from "next/navigation";
import { MembersDialog } from "./members/members-dialog";
import { SettingsDialog } from "./settings-dialog";
import NavButton from "./nav-btn";
import { History, Inbox, Star } from "lucide-react";
import { NotificationWrapper } from "@/components/notification-wrapper";

export const OrgSidebar = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const team = useGetTeams().data?.find((t) => t.id.toString() === teamId);
  return (
    <div className="hidden h-full lg:flex flex-col gap-y-2 w-52 bg-slate-100">
      <div className="flex items-center justify-center border-b w-full h-fit py-5">
        <h1 className="font-bold md:text-2xl font-mono xl pointer-events-none select-none text-center">
          Teamscribe
        </h1>
      </div>

      {!teamId && (
        <div className="flex flex-col px-2 gap-1 w-full h-full items-center justify-start text-center font-semibold">
          <NotificationWrapper notifications={-1} className="w-full">
            <NavButton icon={Inbox} text="Inbox" param="inbox" />
          </NotificationWrapper>
          <NavButton icon={History} text="Recent" param="recent" />
          <NavButton icon={Star} text="Starred" param="starred" />
        </div>
      )}

      {team && (
        <div className="flex flex-col px-2 gap-1 w-full h-full items-center justify-start text-center font-semibold">
          <MembersDialog teamId={team.id} />
          <SettingsDialog />
        </div>
      )}
    </div>
  );
};
