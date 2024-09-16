"use client";

import { useState, ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { socket } from "./websocket";
import { usePathname, useRouter } from "next/navigation";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 600 * 1000,
          gcTime: 1000 * 60 * 60 * 24,
        },
      },
    })
  );

  socket.on("new_notification", () => {
    client.invalidateQueries({ queryKey: ["notifications"] });
  });

  socket.on("team_member_updated", (teamId: any) => {
    client.invalidateQueries({ queryKey: ["team-members", { teamId: teamId.toString() }] });
  });

  socket.on("removed_from_team", (teamId: any) => {
    client.invalidateQueries({ queryKey: ["teams"] });
    if (pathname === `/dashboard/${teamId}`) {
      console.log("redirecting to dashboard");
      router.push("/dashboard");
    }
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
