"use client";

import { useState, ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
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

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
