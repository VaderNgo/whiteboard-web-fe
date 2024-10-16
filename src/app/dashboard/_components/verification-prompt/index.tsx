"use client";

import { useLoggedInUser } from "@/lib/services/queries";
import { socket } from "@/lib/websocket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function VerificationPrompt() {
  const user = useLoggedInUser();
  const queryClient = useQueryClient();
  const websocket = socket;

  useEffect(() => {
    if (!user.data?.emailVerified) {
      websocket.on("account_updated", () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      });
    }

    return () => {
      websocket.off("account_updated");
    };
  }, []);

  if (user.data?.id && !user.data.emailVerified && !user.isLoading) {
    return (
      <div className="w-full h-10 flex justify-center items-center bg-yellow-500 text-black border-b border-yellow-600 font-semibold">
        A verification email has been sent to your email address. Please verify your email address
        to continue.
      </div>
    );
  }

  return null;
}
