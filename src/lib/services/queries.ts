import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "../axios";
import { Plan } from "../plans-enum";

export type Team = {
  id: string;
  name: string;
  description?: string;
  logo: string;
  plan: Plan;
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
  accountPlan: Plan;
};

export function useLoggedInUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => (await AxiosInstance.get<LoggedInUser>("/auth/me")).data,
  });
}

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

export type TeamMembersResponse = {
  currentMembers: TeamMember[];
  pendingMembers: TeamMember[];
};

export function useGetTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ["team-members", { teamId }],
    queryFn: async () =>
      (await AxiosInstance.get<TeamMembersResponse>(`/teams/${teamId}/members`)).data,
    placeholderData: keepPreviousData,
  });
}
