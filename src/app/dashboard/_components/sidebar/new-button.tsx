"use client";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";
import { ImagePreviewer } from "@/components/image-previewer";
import { useState } from "react";
import CreateTeamForm from "./create-team-form";
import { cn } from "@/lib/utils";

export const NewButton = ({
  disabled = false,
  label = "Add team",
}: {
  disabled: boolean;
  label: string;
}) => {
  const [selectedLogo, setLogo] = useState("");
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint label={label} side="right" sideOffset={10}>
            <button
              disabled={disabled}
              onClick={() => setOpen(!isOpen)}
              className={cn(
                "bg-black/10 h-full w-full rounded-md flex items-center justify-center opacity-60 transition",
                !disabled && "hover:opacity-100 active:scale-90 transition-transform",
                disabled && "cursor-not-allowed"
              )}
            >
              <Plus className="text-black" />
            </button>
          </Hint>
        </div>
      </DialogTrigger>

      <DialogContent>
        <h2 className="text-xl font-bold">Create a new team</h2>

        <div className="flex gap-5">
          <div className="flex-1 h-fit">
            <CreateTeamForm
              onSubmitSuccess={async () => {
                setOpen(false);
                setLogo("");
              }}
              selectedLogo={selectedLogo}
            />
          </div>

          <div className="flex flex-col">
            <h3 className="font-medium font-mono">Logo</h3>
            <ImagePreviewer setImageUri={setLogo} imageUri={selectedLogo} className="w-32 h-32" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
