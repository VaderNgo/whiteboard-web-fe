"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, RegisterOptions } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCreateAccount } from "@/lib/services/mutations";
import { LoaderCircle, X } from "lucide-react";

interface InputFieldProps {
  label: string;
  type: string;
  errorMessage?: string;
  register: any;
  name: string;
  validationOptions?: RegisterOptions;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  errorMessage,
  register,
  name,
  validationOptions,
}) => (
  <div className="w-full">
    <h3 className="font-medium">{label}</h3>
    <input
      type={type}
      className="border border-black rounded-sm p-2 w-full"
      {...register(name, validationOptions)}
    />
    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
  </div>
);

interface FormProps {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ children }) => (
  <form className="pointer-events-auto font-mono flex flex-col items-center w-full gap-5">
    {children}
  </form>
);

interface SignupFormContainerProps {
  children: React.ReactNode;
}

const SignupFormContainer: React.FC<SignupFormContainerProps> = ({ children }) => (
  <div className="bg-white/90 w-full h-full p-5 rounded-md border relative">
    <h2 className="text-center font-semibold font-mono text-3xl mb-2">Signup</h2>
    {children}
  </div>
);
``;
const inputSchema = z.object({
  username: z.string().min(3, "Username must be at least 5 characters long").max(15),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
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

export type SignupBodyType = z.infer<typeof inputSchema>;

export default function SignupForm({ onClose }: { onClose: () => void }) {
  const [registered, setRegistered] = useState(false);
  const createAccount = useCreateAccount();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignupBodyType>({
    mode: "onBlur",
    resolver: zodResolver(inputSchema),
  });

  const onSubmit: SubmitHandler<SignupBodyType> = async (data) => {
    try {
      await createAccount.mutateAsync(data);
      clearErrors();
      setRegistered(true);
    } catch (err: any) {
      const errMessage = err.message;
      if (errMessage.includes("Username")) setError("username", { message: errMessage });
      else if (errMessage.includes("Email")) setError("email", { message: errMessage });
    }
  };

  return (
    <SignupFormContainer>
      <X
        onClick={onClose}
        className="absolute top-2 right-2 opacity-50 size-5 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
      />
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
            registered
          }
          className="mt-4 p-2 bg-blue-500 text-white rounded-sm font-bold disabled:opacity-50 w-32"
          onClick={handleSubmit(onSubmit)}
        >
          {createAccount.isPending ? (
            <LoaderCircle className="animate-spin text-white" />
          ) : (
            "Sign up"
          )}
        </button>
      </Form>
    </SignupFormContainer>
  );
}
