import { useMutation } from "@tanstack/react-query";
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
