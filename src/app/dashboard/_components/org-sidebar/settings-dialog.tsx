import { LoaderCircle, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Team } from "@/lib/services/queries";
import { ImagePreviewer } from "@/components/image-previewer";
import { useState, useEffect } from "react";
import { FormContainer, InputField, Form } from "@/components/ui/form";
import { useForm, WatchObserver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateTeam, useUploadTeamLogo } from "@/lib/services/mutations";

const editTeamSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(15),
  description: z.string().min(3, "Description must be at least 3 characters long").max(100),
});

type EditTeamBody = z.infer<typeof editTeamSchema>;

export const SettingsDialog = (team?: Team) => {
  const [imageUri, setImageUri] = useState(team?.logo || "");
  const [isUpdated, setUpdated] = useState(false);
  const [rootMessage, setRootMessage] = useState("");
  const [rootType, setRootType] = useState<"error" | "success">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const uploadLogo = useUploadTeamLogo();
  const updateTeam = useUpdateTeam();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditTeamBody>({
    mode: "onBlur",
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: team?.name || "",
      description: team?.description || "",
    },
  });

  const watchedFields = watch(["name", "description"]);

  useEffect(() => {
    // Compare initial values with the current form values
    const hasFormChanged =
      team?.name !== watchedFields[0] ||
      team?.description !== watchedFields[1] ||
      team?.logo !== imageUri;

    setHasChanged(hasFormChanged);
  }, [watchedFields, imageUri, team]);

  async function onSubmit(data: EditTeamBody) {
    if (!hasChanged) return;
    setIsSubmitting(true);
    try {
      if (team?.logo !== imageUri) {
        try {
          await handleUploadLogo(Number(team!.id));
        } catch {
          setRootMessage("Logo size must be less than 256kb");
          setRootType("error");
          setIsSubmitting(false);
          return;
        }
      }

      if (team?.name !== watchedFields[0] || team?.description !== watchedFields[1]) {
        try {
          await updateTeam.mutateAsync({
            id: Number(team!.id),
            data: {
              newName: data.name,
              newDescription: data.description,
            },
          });
        } catch {
          setRootMessage("Failed to update team");
          setRootType("error");
          setIsSubmitting(false);
          return;
        }
      }

      setUpdated(true);
      setRootMessage("Team updated successfully");
      setRootType("success");
      setIsOpen(false);
      setUpdated(false);
    } catch (error) {
      setRootMessage("Failed to update team");
      setRootType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUploadLogo = async (teamId: number) => {
    if (!imageUri) return;
    const blob = await (await fetch(imageUri)).blob();

    const formData = new FormData();
    formData.append("logo", blob);
    await uploadLogo.mutateAsync({ id: teamId, data: formData });
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-slate-200 bg-transparent px-2 border-none font-normal"
        >
          <div className="flex items-center w-full">
            <Settings2 className="mr-2" size={25} />
            <p className="">Settings</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="text-xl font-bold">Settings</div>
          </DialogTitle>
          <DialogDescription>Configure your team settings here.</DialogDescription>
        </DialogHeader>

        <div className="flex w-full gap-5 flex-1">
          <ImagePreviewer
            setImageUri={setImageUri}
            defaultUri={team?.logo}
            className="h-32 w-32 mt-6"
          />
          <div className="w-full">
            <FormContainer rootMessage={rootMessage} rootType={rootType} containerLess>
              <Form>
                <InputField
                  label="Name"
                  name="name"
                  type="text"
                  register={register}
                  errorMessage={errors.name?.message}
                />
                <InputField
                  label="Description"
                  type="text"
                  name="description"
                  register={register}
                  errorMessage={errors.description?.message}
                />
                <button
                  type="submit"
                  disabled={
                    !hasChanged ||
                    !!errors.name ||
                    !!errors.description ||
                    isUpdated ||
                    isSubmitting
                  }
                  onClick={handleSubmit(onSubmit)}
                  className="mt-4 p-2 bg-blue-500 ml-auto text-white rounded-sm font-bold disabled:opacity-50 w-32 flex items-center justify-center"
                >
                  {isSubmitting ? <LoaderCircle className="animate-spin text-white" /> : "Save"}
                </button>
              </Form>
            </FormContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
