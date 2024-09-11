import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "../axios";
import { SignupBodyType } from "@/app/_components/signup-form";

export function useCreateAccount() {
  return useMutation({
    mutationFn: async (data: SignupBodyType) => {
      return await AxiosInstance.post("/auth/register", {
        username: data.username,
        password: data.password,
        email: data.email,
      });
    },

    onMutate: () => {},
  });
}
