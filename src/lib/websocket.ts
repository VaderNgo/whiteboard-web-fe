"use client";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API_ROUTE!, {
  withCredentials: true,
});
