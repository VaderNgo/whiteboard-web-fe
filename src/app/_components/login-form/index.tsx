"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useLogin } from "@/lib/services/mutations";
import { LoaderCircle } from "lucide-react";
import { FormContainer, InputField, Form } from "@/components/ui/form";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(15),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginBodyType = z.infer<typeof loginSchema>;

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const [loggedIn, setRegistered] = useState(false);
  const [rootError, setRootError] = useState("");
  const login = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginBodyType>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginBodyType> = async (data) => {
    try {
      await login.mutateAsync(data);
      clearErrors();
      setRegistered(true);
      setRootError("");
      router.push("/dashboard");
    } catch (err: any) {
      setRootError("Wrong username or password");
    }
  };

  return (
    <FormContainer title="Login" onClose={onClose} rootMessage={rootError}>
      <Form>
        <InputField
          label="Username"
          type="text"
          name="username"
          register={register}
          errorMessage={errors.username?.message}
          validationOptions={{ required: "Username is required" }}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          register={register}
          errorMessage={errors.password?.message}
          validationOptions={{ required: "Password is required" }}
        />

        <button
          type="submit"
          disabled={
            errors.password != undefined ||
            errors.username != undefined ||
            login.isPending ||
            loggedIn
          }
          className="mt-4 p-2 bg-blue-500 text-white rounded-sm font-bold disabled:opacity-50 w-32 flex items-center justify-center"
          onClick={handleSubmit(onSubmit)}
        >
          {login.isPending ? <LoaderCircle className="animate-spin text-white" /> : "Log in"}
        </button>
      </Form>
    </FormContainer>
  );
}
