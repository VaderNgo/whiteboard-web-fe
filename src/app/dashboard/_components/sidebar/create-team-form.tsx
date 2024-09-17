"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LoaderCircle } from "lucide-react";
import { FormContainer, InputField, Form } from "@/components/ui/form";
import { useCreateTeam, useUploadLogo } from "@/lib/services/mutations";

const createTeamSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(15),
  description: z.string().min(3, "Description must be at least 3 characters long").max(100),
});

export type CreateTeamBody = z.infer<typeof createTeamSchema>;

export default function CreateTeamForm({
  onSubmitSuccess,
  selectedLogo,
}: {
  onSubmitSuccess: () => Promise<void>;
  selectedLogo?: string;
}) {
  const [created, setCreated] = useState(false);
  const [rootMessage, setRootMessage] = useState("");
  const [rootType, setRootType] = useState<"error" | "success">("error");
  const createTeam = useCreateTeam();
  const uploadLogo = useUploadLogo();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<CreateTeamBody>({
    mode: "onBlur",
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit: SubmitHandler<CreateTeamBody> = async (data) => {
    try {
      const createdTeam = await createTeam.mutateAsync(data);
      clearErrors();
      setCreated(true);
      setRootType("success");
      setRootMessage("Team created successfully");

      await handleUploadLogo(createdTeam.id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await onSubmitSuccess();
    } catch (err: any) {
      setRootType("error");
      setRootMessage("Something went wrong. \nPlease try again later.");
    }
  };

  const handleUploadLogo = async (teamId: number) => {
    if (!selectedLogo) return;
    const blob = await (await fetch(selectedLogo)).blob();

    const formData = new FormData();
    formData.append("logo", blob);
    await uploadLogo.mutateAsync({ id: teamId, data: formData });
  };

  return (
    <FormContainer rootMessage={rootMessage} rootType={rootType} containerLess>
      <Form>
        <InputField
          label="Name"
          type="text"
          name="name"
          register={register}
          errorMessage={errors.name?.message}
          validationOptions={{ required: "Name is required" }}
        />
        <InputField
          label="Description"
          type="text"
          name="description"
          register={register}
          errorMessage={errors.description?.message}
          validationOptions={{ required: "Description is required" }}
        />

        <button
          type="submit"
          disabled={errors.name != undefined || errors.description != undefined || created}
          className="mt-4 p-2 bg-blue-500 text-white rounded-sm font-bold disabled:opacity-50 w-32 flex items-center justify-center"
          onClick={handleSubmit(onSubmit)}
        >
          {"" ? <LoaderCircle className="animate-spin text-white" /> : "Create"}
        </button>
      </Form>
    </FormContainer>
  );
}
