import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "../axios";
import { RegiterBodyType } from "@/app/_components/signup-form";

export function useCreateAccount() {
  return useMutation({
    mutationFn: async (data: RegiterBodyType) => {
      return await AxiosInstance.post("/auth/register", {
        username: data.username,
        password: data.password,
        email: data.email,
      });
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await AxiosInstance.post("/auth/login", {
        username: data.username,
        password: data.password,
      });
    },
  });
}

export type TeamCreateResponse = {
  name: string;
  description: string;
  logo: string;
  id: number;
};

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return (
        await AxiosInstance.post<TeamCreateResponse>("/teams", {
          name: data.name,
          description: data.description,
        })
      ).data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await AxiosInstance.post(`/teams/${id}/logo`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, recipientEmail }: { teamId: string; recipientEmail: string }) => {
      return await AxiosInstance.post(`/teams/${teamId}/members`, {
        recipientEmail,
      });
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["team-members", { teamId: variables.teamId }] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, memberId }: { teamId: string; memberId: string }) => {
      return await AxiosInstance.delete(`/teams/${teamId}/members/${memberId}`);
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["team-members", { teamId: variables.teamId }] });
    },
  });
}
