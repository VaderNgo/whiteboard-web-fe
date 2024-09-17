import { Settings2 } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SettingsDialog = () => {
  return (
    <Dialog>
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
      <DialogContent></DialogContent>
    </Dialog>
  );
};
