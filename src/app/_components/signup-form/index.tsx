"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCreateAccount, useLogin } from "@/lib/services/mutations";
import { LoaderCircle } from "lucide-react";
import { FormContainer, InputField, Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(15),
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((password: string) => {
      let hasUppercase = false;
      for (let i = 0; i < password.length; i++) {
        if (isNaN(password[i] as any) && password[i] == password[i].toUpperCase()) {
          hasUppercase = true;
          break;
        }
      }
      return hasUppercase;
    }, "Password must contain at least one uppercase letter"),
});

export type RegiterBodyType = z.infer<typeof registerSchema>;

export default function SignupForm({ onClose }: { onClose: () => void }) {
  const [registered, setRegistered] = useState(false);
  const [rootMessage, setRootMessage] = useState("");
  const [rootType, setRootType] = useState<"error" | "success">("error");
  const createAccount = useCreateAccount();
  const login = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegiterBodyType>({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegiterBodyType> = async (data) => {
    try {
      await createAccount.mutateAsync(data);

      clearErrors();
      setRegistered(true);
      setRootType("success");
      setRootMessage("Account created successfully. \nLogging in...");

      await login.mutateAsync({ username: data.username, password: data.password });

      await new Promise((resolve) => setTimeout(resolve, 2000)); // User experience I know
      router.push("/dashboard");
    } catch (err: any) {
      const errMessage = err.message;
      setRootType("error");
      if (errMessage.includes("Username")) setError("username", { message: errMessage });
      else if (errMessage.includes("Email")) setError("email", { message: errMessage });
      else setRootMessage("Something went wrong. \nPlease try again later.");
    }
  };

  return (
    <FormContainer title="Signup" onClose={onClose} rootMessage={rootMessage} rootType={rootType}>
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
          label="Email"
          type="email"
          name="email"
          register={register}
          errorMessage={errors.email?.message}
          validationOptions={{ required: "Email is required" }}
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
            errors.email != undefined ||
            errors.password != undefined ||
            errors.username != undefined ||
            createAccount.isPending ||
            login.isPending ||
            registered
          }
          className="mt-4 p-2 bg-blue-500 text-white rounded-sm font-bold disabled:opacity-50 w-32 flex items-center justify-center"
          onClick={handleSubmit(onSubmit)}
        >
          {createAccount.isPending || login.isPending ? (
            <LoaderCircle className="animate-spin text-white" />
          ) : (
            "Sign up"
          )}
        </button>
      </Form>
    </FormContainer>
  );
}
