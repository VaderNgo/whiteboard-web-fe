import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "../axios";

export type Team = {
  id: string;
  name: string;
  description?: string;
  logo: string;
  maxMembers: number;
  role: string;
};

export function useGetTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => (await AxiosInstance.get<Team[]>("/teams")).data,
    placeholderData: keepPreviousData,
  });
}

export type LoggedInUser = {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
  createdAt: string;
  maxOwnedTeams: number;
};

export function useLoggedInUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => (await AxiosInstance.get<LoggedInUser>("/auth/me")).data,
  });
}
