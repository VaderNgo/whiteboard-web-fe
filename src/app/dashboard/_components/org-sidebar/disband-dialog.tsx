import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useDisbandTeam } from "@/lib/services/mutations";

export const DisbandDialog = ({ teamId }: { teamId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const disbandTeam = useDisbandTeam();

  const handleDisband = async () => {
    await disbandTeam.mutateAsync({ teamId });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-red-200 bg-transparent px-2 border-none font-normal text-red-400 hover:text-red-500"
        >
          <div className="flex items-center w-full">
            <Trash2 className="mr-2" size={25} />
            <div className="">Disband team</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="text-xl font-bold">Are you sure?</div>
          </DialogTitle>
          <DialogDescription>
            This will disband the team and remove any associated team boards.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="mr-2"
            onClick={handleDisband}
            disabled={disbandTeam.isPending}
          >
            Disband
          </Button>
          <Button variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
