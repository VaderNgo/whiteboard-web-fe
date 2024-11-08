"use client";
import { Form, FormContainer, InputField } from "@/components/ui/form";
import { useCreateBoard } from "@/lib/services/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const createBoardSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(64),
});

export type CreateBoardBody = z.infer<typeof createBoardSchema>;

export default function CreateBoardForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => Promise<void>;
}) {
  const [created, setCreated] = useState(false);
  const [rootMessage, setRootMessage] = useState("");
  const [rootType, setRootType] = useState<"error" | "success">("error");
  const createBoard = useCreateBoard();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<CreateBoardBody>({
    mode: "onBlur",
    resolver: zodResolver(createBoardSchema),
  });

  const onSubmit: SubmitHandler<CreateBoardBody> = async (data) => {
    try {
      console.log(data.name);
      await createBoard.mutateAsync({ name: data.name, teamId: 1 });
      clearErrors();
      setCreated(true);
      setRootType("success");
      setRootMessage("Board created successfully");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      await onSubmitSuccess();
    } catch (err: any) {
      setRootType("error");
      setRootMessage("Something went wrong. \nPlease try again later.");
    }
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
        <button
          type="submit"
          disabled={errors.name != undefined || created}
          className="mt-4 p-2 bg-blue-500 text-white rounded-sm font-bold disabled:opacity-50 w-32 flex items-center justify-center"
          onClick={handleSubmit(onSubmit)}
        >
          {created ? <LoaderCircle className="animate-spin text-white" /> : "Create"}
        </button>
      </Form>
    </FormContainer>
  );
}
