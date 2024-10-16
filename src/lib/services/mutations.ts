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

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      return await AxiosInstance.post("/auth/logout");
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

export function useUploadTeamLogo() {
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

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await AxiosInstance.put(`/users/${id}/avatar`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
      queryClient.invalidateQueries({
        queryKey: ["team-members", { teamId: variables.teamId.toString() }],
      });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, memberId }: { teamId: string; memberId: string }) => {
      return await AxiosInstance.delete(`/teams/${teamId}/members/${memberId}`);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team-members", { teamId: variables.teamId }] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await AxiosInstance.patch(`/notifications/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useReplyInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ inviteId: id, accept }: { inviteId: string; accept: boolean }) => {
      return await AxiosInstance.patch(`/invites/${id}`, {
        status: accept ? "ACCEPTED" : "REJECTED",
      });
    },

    onSuccess: (_, variables) => {
      if (variables.accept) {
        queryClient.invalidateQueries({ queryKey: ["teams"] });
      }
    },
  });
}

export function useDisbandTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId }: { teamId: string }) => {
      return await AxiosInstance.delete(`/teams/${teamId}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { newName?: string; newDescription?: string };
    }) => {
      return await AxiosInstance.patch(`/teams/${id}`, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      return await AxiosInstance.put("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    },
  });
}
