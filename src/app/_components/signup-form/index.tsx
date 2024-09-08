"use client";

import React from "react";
import { useForm, SubmitHandler, RegisterOptions } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
  <div className="bg-white/90 w-full h-full p-5 rounded-md border">
    <h2 className="text-center font-semibold font-mono text-3xl mb-2">Signup</h2>
    {children}
  </div>
);

const inputSchema = z.object({
  username: z.string().min(1, "Username is required").max(15),
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

type InputType = z.infer<typeof inputSchema>;

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>({
    mode: "onChange",
    resolver: zodResolver(inputSchema),
  });

  const onSubmit: SubmitHandler<InputType> = (data) => {
    console.log(data);
  };

  return (
    <SignupFormContainer>
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
            errors.username != undefined
          }
          className="mt-4 p-2 bg-blue-500 text-white rounded-sm font-bold disabled:opacity-50"
          onClick={handleSubmit(onSubmit)}
        >
          Sign Up
        </button>
      </Form>
    </SignupFormContainer>
  );
};

export default SignupForm;
