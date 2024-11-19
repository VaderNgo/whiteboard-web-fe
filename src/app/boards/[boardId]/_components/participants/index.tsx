import { ChevronDown, Play, Presentation } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import { LoggedInUser, useLoggedInUser } from "@/lib/services/queries";
import useSocket from "../../_hooks/useSocket";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Participants = () => {
  const {
    boardUsers,
    presentation,
    setPresentation,
    stageConfig,
    isJoinedPresentation,
    setIsJoinedPresentation,
  } = useContext(BoardContext);
  const [visibleCollaborators, setVisibleCollaborators] = useState<LoggedInUser[]>([]);
  const [extraCount, setExtraCount] = useState(0);
  const owner = useLoggedInUser();
  const { startPresentation, joinPresentation } = useSocket();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  useEffect(() => {
    const usersArray = Array.from(boardUsers.values());
    const newExtraCount = usersArray.length > 2 ? usersArray.length - 2 : 0;
    const newVisibleCollaborators = usersArray.slice(0, 2);
    console.log("visible", newVisibleCollaborators);
    setExtraCount(newExtraCount);
    setVisibleCollaborators(newVisibleCollaborators);
  }, [boardUsers]);

  const handlePresentationClick = (type: number) => {
    switch (type) {
      case 0:
        startPresentation({ user: owner.data!, data: stageConfig });
        break;
      case 1:
        joinPresentation();
        break;
    }
  };

  useEffect(() => {}, [presentation, isJoinedPresentation]);

  return (
    <>
      <div className="absolute z-10 h-12 top-2 right-2 bg-white rounded-e-md flex items-center shadow-md">
        <div className="flex h-full w-full justify-center items-center space-x-3 p-2">
          <div className="aspect-square h-full rounded flex justify-center items-center">
            <button className=" h-full rounded-sm bg-gray-200 flex flex-row justify-center items-center space-x-2 p-3">
              <Play size={15} fill="black" />
              {!presentation && !isJoinedPresentation && (
                <span className="text-sm" onClick={() => handlePresentationClick(0)}>
                  Present
                </span>
              )}
              {presentation &&
                presentation?.user.id !== owner.data?.id &&
                !isJoinedPresentation && (
                  <span className="text-sm" onClick={() => handlePresentationClick(1)}>
                    Join
                  </span>
                )}
            </button>
          </div>

          <div className="relative flex items-center space-x-1">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex justify-center items-center border-2 border-blue-500">
              <img src={owner.data?.avatar} alt="owner" className="w-full h-full rounded-full" />
            </div>

            <button className="w-10 h-6 bg-gray-200 rounded-lg flex items-center space-x-1 justify-center font-semibold text-black">
              <span>{boardUsers.size}</span>
              <ChevronDown className="size-3" />
            </button>

            <div className="relative -ml-4 flex">
              {visibleCollaborators
                .filter((collaborator) => collaborator.id !== owner.data?.id)
                .map((collaborator, index) => (
                  <div
                    key={collaborator.id || index}
                    className={`w-8 h-8 rounded-full flex justify-center items-center ${
                      index === 0 ? "z-20" : "z-10 -ml-2"
                    } border-2 border-yellow-500`}
                  >
                    <img
                      src={collaborator.avatar}
                      alt={`collaborator-${index}`}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                ))}

              {extraCount > 0 && (
                <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center z-30 -ml-2 border-2 border-gray-400">
                  <span className="text-sm">+{extraCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={
          isDialogOpen &&
          !!(presentation && presentation?.user.id !== owner.data?.id && !isJoinedPresentation)
        }
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Presentation started{" "}
              <span className="text-blue-800">by {presentation?.user.username}</span>
            </DialogTitle>
            <DialogDescription>
              <div className="w-full flex justify-center">
                <img src={`/gif/meeting.gif`} className="size-28" />
              </div>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="z-20 w-10 h-10 rounded-full flex justify-center items-center border-2 border-yellow-500">
                  <img src={presentation?.user.avatar} className="w-full h-full rounded-full" />
                </div>
                <div className="z-10 w-10 h-10 rounded-full flex justify-center items-center border-2 border-yellow-600 -ml-4 bg-gray-200"></div>
                <span className="text-gray-500 text-xl ml-3">
                  {presentation?.user.username} is waiting for people to join
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-gray-400" onClick={() => setIsDialogOpen(false)}>
              Not Now
            </Button>
            <Button className="bg-blue-500" type="submit" autoFocus>
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Participants;
