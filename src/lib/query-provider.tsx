"use client";

import { useState, ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { socket } from "./websocket";
import { usePathname, useRouter } from "next/navigation";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 600 * 1000,
            gcTime: 1000 * 60 * 60 * 24,
          },
        },
      })
  );

  const handleNewNotification = () => {
    client.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleTeamMemberUpdated = (teamId: string) => {
    client.invalidateQueries({ queryKey: ["team-members", { teamId: teamId.toString() }] });
  };

  const handleRemovedFromTeam = (teamId: string) => {
    client.invalidateQueries({ queryKey: ["teams"] });
    if (pathname === `/dashboard/${teamId}`) {
      router.push("/dashboard");
    }
  };

  const handleTeamUpdated = (teamId: string) => {
    client.invalidateQueries({ queryKey: ["teams"] });
  };

  socket.on("new_notification", handleNewNotification);
  socket.on("team_member_updated", handleTeamMemberUpdated);
  socket.on("removed_from_team", handleRemovedFromTeam);
  socket.on("team_updated", handleTeamUpdated);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
