"use client";

import { ImagePreviewer } from "@/components/image-previewer";
import { Form, FormContainer, InputField } from "@/components/ui/form";
import { useChangePassword, useLogout, useUploadProfilePicture } from "@/lib/services/mutations";
import { useLoggedInUser } from "@/lib/services/queries";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, CircleX } from "lucide-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

export const AccountSettings = () => {
  const { data } = useLoggedInUser();
  const [imageUri, setImageUri] = useState(data?.avatar);
  const [changingPassword, setChangingPassword] = useState(false);

  const uploadProfilePicture = useUploadProfilePicture();
  const changePassword = useChangePassword();
  const logout = useLogout();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors, isValid },
  } = useForm<ChangePasswordType>({
    mode: "onBlur",
    resolver: zodResolver(ChangePasswordSchema),
  });

  useEffect(() => {
    if (!changingPassword) {
      resetField("oldPassword");
      resetField("newPassword");
      resetField("confirmPassword");
    }
  }, [changingPassword]);

  useEffect(() => {
    setImageUri(data?.avatar);
  }, [data]);

  const onSubmit = async (data: ChangePasswordType) => {
    try {
      await changePassword.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      await logout.mutateAsync();
      router.push("/login");
    } catch {
      setError("oldPassword", { message: "Incorrect password" });
    }
  };

  const handleUploadLogo = async (userId: number) => {
    if (!imageUri) return;
    const blob = await (await fetch(imageUri)).blob();

    const formData = new FormData();
    formData.append("avatar", blob);
    await uploadProfilePicture.mutateAsync({ id: userId, data: formData });
  };

  return (
    <div className="flex flex-col p-2 w-full h-full gap-5">
      {/* Profile section */}
      <div>
        <div className="font-medium text-xl">Profile</div>
        <hr />
      </div>

      {/* Profile picture and account information */}
      <div className="flex gap-5">
        {/* Change profile picture */}
        <div>
          <div className="relative">
            <ImagePreviewer setImageUri={setImageUri} imageUri={imageUri!} className="h-24 w-24" />
            <div className="absolute rounded-b-md flex items-center justify-center text-white font-bold w-full bottom-0 left-0 h-6 bg-neutral-900/50 pointer-events-none">
              Edit
            </div>
          </div>
          {imageUri !== data?.avatar && !uploadProfilePicture.isPending && (
            <div className="flex justify-center gap-2 text-xs">
              <button
                className="text-green-500 disabled:opacity-20 disabled:text-black"
                onClick={() => handleUploadLogo(data?.id!)}
              >
                Save
              </button>{" "}
              /{" "}
              <button className="text-red-500" onClick={() => setImageUri(data?.avatar)}>
                Reset
              </button>
            </div>
          )}

          {imageUri !== data?.avatar && uploadProfilePicture.isPending && (
            <div className="flex justify-center gap-2 text-xs text-green-500">Saving</div>
          )}
        </div>

        {/* Profile info */}
        <div className="flex">
          <div className="flex flex-col">
            {/* Username */}
            <div className="font-medium text-xl">{data?.username}</div>
            {/* Email and verification status */}
            <div className="flex items-center">
              <div className="font-light opacity-50">{data?.email}</div>
              {data?.emailVerified && (
                <div className="flex items-center gap-1 text-green-600 text-sm ml-4">
                  <CircleCheck className="ml-2 h-4 w-4" />
                  Verified
                </div>
              )}
              {!data?.emailVerified && (
                <div className="flex items-center gap-1 text-red-600 text-sm ml-4">
                  <CircleX className="ml-2 h-4 w-4" />
                  Not verified
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password section */}
      <div>
        <div className="flex gap-2">
          <div className="font-medium text-xl mr-auto">Password</div>
          <div
            className={cn(
              "flex items-center text-xs italic opacity-90 hover:opacity-100",
              changePassword.isPending && "opacity-50 pointer-events-none"
            )}
          >
            {!changingPassword ? (
              <button
                className="text-blue-500"
                onClick={() => setChangingPassword((prev) => !prev)}
              >
                Change
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  className="text-green-500 disabled:opacity-20 disabled:text-black"
                  disabled={!isValid}
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  Confirm
                </button>{" "}
                /{" "}
                <button
                  className="text-red-500"
                  onClick={() => setChangingPassword((prev) => !prev)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />

        {/* Change password form */}
        <FormContainer containerLess>
          <Form
            className={cn(
              "flex flex-row items-start mt-2",
              inter.className,
              (!changingPassword || changePassword.isPending) && "pointer-events-none opacity-30"
            )}
          >
            <InputField
              label="Old password"
              type="password"
              name="oldPassword"
              register={register}
              className="flex-1"
              errorMessage={errors.oldPassword?.message}
              validationOptions={{ required: "Username is required" }}
            />
            <div className="flex-1 flex flex-col gap-3 font-normal">
              <InputField
                label="New password"
                type="password"
                name="newPassword"
                register={register}
                errorMessage={errors.newPassword?.message}
                validationOptions={{ required: "Email is required" }}
              />
              <InputField
                label="Confirm new password"
                type="password"
                name="confirmPassword"
                register={register}
                errorMessage={errors.confirmPassword?.message}
                validationOptions={{ required: "Password is required" }}
              />
            </div>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
};

const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z
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
    confirmPassword: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
