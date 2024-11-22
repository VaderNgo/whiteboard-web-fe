import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoggedInUser, useLoggedInUser } from "@/lib/services/queries";
import { Dialog } from "@radix-ui/react-dialog";
import { ChevronDown, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import useSocket from "../../_hooks/useSocket";

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
  const [extraCountParticipant, setExtraCountParticipant] = useState(0);
  const [visibleParticipants, setVisibleParticipants] = useState<LoggedInUser[]>([]);
  const owner = useLoggedInUser();
  const { startPresentation, joinPresentation, leavePresentation, endPresentation } = useSocket();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  useEffect(() => {
    const usersArray = Array.from(boardUsers.values()).filter((user) => user.id !== owner.data?.id);
    const newExtraCount = usersArray.length > 2 ? usersArray.length - 2 : 0;
    const newVisibleCollaborators = usersArray.slice(0, 2);
    setExtraCount(newExtraCount);
    setVisibleCollaborators(newVisibleCollaborators);
  }, [boardUsers]);

  useEffect(() => {
    if (presentation) {
      const participantsArray = Array.from(presentation.participants.values()).filter(
        (user) => user.id !== owner.data?.id
      );
      const newExtraCountParticipant =
        participantsArray.length > 2 ? participantsArray.length - 2 : 0;
      const newVisibleParticipants = participantsArray.slice(0, 2);
      setExtraCountParticipant(newExtraCountParticipant);
      setVisibleParticipants(newVisibleParticipants);
    }
  }, [presentation]);

  const handlePresentationClick = (type: number) => {
    switch (type) {
      case 0:
        startPresentation(stageConfig);
        break;
      case 1:
        joinPresentation();
        break;
      case 2:
        leavePresentation();
        break;
      case 3:
        endPresentation();
        break;
    }
  };

  useEffect(() => {
    console.log("presentation", presentation);
    console.log("isJoinedPresentation", isJoinedPresentation);
    console.log("participants", presentation?.participants);
  }, [presentation]);

  return (
    <>
      <div className="absolute z-10 h-12 top-2 right-2 bg-white rounded-e-md flex items-center shadow-md">
        <div className="flex h-full w-full justify-center items-center space-x-3 p-2">
          <div className="aspect-square h-full rounded flex justify-center items-center">
            {!presentation && (
              <button
                className=" h-full rounded-sm bg-gray-200 flex flex-row justify-center items-center space-x-2 p-3"
                onClick={() => handlePresentationClick(0)}
              >
                <Play size={15} fill="black" />
                <span className="text-sm">Present</span>
              </button>
            )}
            {presentation &&
              presentation.presenter?.id !== owner.data?.id &&
              presentation.participants
                .values()
                .find((enhancedUser) => enhancedUser.id === owner.data?.id) === undefined && (
                <button
                  className=" h-full rounded-sm bg-gray-200 flex flex-row justify-center items-center space-x-2 p-3"
                  onClick={() => handlePresentationClick(1)}
                >
                  <Play size={15} fill="black" />
                  <span className="text-sm">Join</span>
                </button>
              )}
            {presentation && presentation?.presenter?.id === owner.data?.id && (
              <button
                className=" h-full rounded-sm bg-red-500 text-white flex flex-row justify-center items-center space-x-2 p-3"
                onClick={() => handlePresentationClick(3)}
              >
                <span className="text-sm">End</span>
              </button>
            )}
            {presentation &&
              presentation?.presenter?.id !== owner.data?.id &&
              presentation.participants.size !== 0 &&
              presentation.participants
                .values()
                .find((enhancedUser) => enhancedUser.id === owner.data?.id) !== undefined && (
                <button
                  className=" h-full rounded-sm bg-red-500 text-white flex flex-row justify-center items-center space-x-2 p-3"
                  onClick={() => handlePresentationClick(2)}
                >
                  <span className="text-sm">Leave</span>
                </button>
              )}
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
          !!(
            presentation &&
            presentation?.presenter?.id !== owner.data?.id &&
            presentation.participants
              .values()
              .find((enhancedUser) => enhancedUser.id === owner.data?.id) === undefined
          )
        }
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Presentation started{" "}
              <span className="text-blue-800">by {presentation?.presenter!.username}</span>
            </DialogTitle>
            <DialogDescription>
              <div className="w-full flex justify-center">
                <img src={`/gif/meeting.gif`} className="size-28" />
              </div>
              <div className="w-full flex flex-row justify-center items-center gap-x-5">
                <div className="flex flex-row items-center">
                  <div className="z-40 w-10 h-10 rounded-full flex justify-center items-center border-2 border-yellow-500">
                    <img
                      src={presentation?.presenter!.avatar}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="relative -ml-4 flex">
                    {visibleParticipants
                      .filter((participant) => participant.id !== owner.data?.id)
                      .map((participant, index) => (
                        <div
                          key={participant.id || index}
                          className={`w-10 h-10 rounded-full flex justify-center items-center ${
                            index === 0 ? "z-20" : "z-10 -ml-2"
                          } border-2 border-yellow-500`}
                        >
                          <img
                            src={participant.avatar}
                            alt={`collaborator-${index}`}
                            className="w-full h-full rounded-full"
                          />
                        </div>
                      ))}

                    {extraCountParticipant > 0 && (
                      <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center z-30 -ml-2 border-2 border-gray-400">
                        <span className="text-sm">+{extraCountParticipant}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <span>already joined the presentation. Do you want to join?</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-gray-400" onClick={() => setIsDialogOpen(false)}>
              Not Now
            </Button>
            <Button className="bg-blue-500" onClick={() => handlePresentationClick(1)}>
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Participants;
