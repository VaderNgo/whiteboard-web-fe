import { UserRoundX } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useRemoveMember } from "@/lib/services/mutations";

export const LeaveDialog = ({ teamId, userId }: { teamId: string; userId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const removeMember = useRemoveMember();

  const handleLeave = async () => {
    if (!userId) return;
    await removeMember.mutateAsync({ teamId: teamId, memberId: userId });
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
            <UserRoundX className="mr-2" size={25} />
            <p className="">Leave team</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <div className="text-xl font-bold">Are you sure?</div>
        </DialogTitle>
        <DialogDescription>
          <p>This action cannot be undone.</p>
          <p>You will need to be invited back to rejoin the team.</p>
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="destructive"
            className="mr-2"
            onClick={handleLeave}
            disabled={removeMember.isPending}
          >
            Leave
          </Button>
          <Button variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
