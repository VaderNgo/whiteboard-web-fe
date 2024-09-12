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
  maxMembers: number;
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
