import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "../axios";
import { Plan } from "../plans-enum";
import { Node, Path } from "@/app/boards/[boardId]/_contexts/boardContext";

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
    queryKey: ["team-members", { teamId: teamId.toString() }],
    queryFn: async () => {
      if (!teamId) return { currentMembers: [], pendingMembers: [] };
      return (await AxiosInstance.get<TeamMembersResponse>(`/teams/${teamId}/members`)).data;
    },
  });
}

export type Notification = {
  id: number;
  type: string;
  inviteId?: number;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await AxiosInstance.get<Notification[]>("/notifications")).data,
  });
}

export type ShapeModel = {
  id: string;
  data: Node;
}

export type PathModel = {
  id: string;
  data: Path;
}

export type BoardModel = {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  shapes: ShapeModel[];
  paths: PathModel[];
}

export function useGetBoard(id: string) {
  return useQuery({
    queryKey: ["board", id],
    queryFn: async () => (await AxiosInstance.get<BoardModel>(`/boards/${id}`)).data,
  });
}

