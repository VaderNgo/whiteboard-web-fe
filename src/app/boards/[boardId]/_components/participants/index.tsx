import { ChevronDown, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import { LoggedInUser, useLoggedInUser } from "@/lib/services/queries";

const Participants = () => {
  const { boardUsers } = useContext(BoardContext);
  const [visibleCollaborators, setVisibleCollaborators] = useState<LoggedInUser[]>([]);
  const [extraCount, setExtraCount] = useState(0);
  const owner = useLoggedInUser();
  useEffect(() => {
    const usersArray = Array.from(boardUsers.values());
    const newExtraCount = usersArray.length > 2 ? usersArray.length - 2 : 0;
    const newVisibleCollaborators = usersArray.slice(0, 2);
    setExtraCount(newExtraCount);
    setVisibleCollaborators(newVisibleCollaborators);
    console.log(extraCount);
  }, [boardUsers]);

  return (
    <div className="absolute z-10 h-12 top-2 right-2 bg-white rounded-e-md flex items-center shadow-md">
      <div className="flex h-full w-full justify-center items-center space-x-3 p-2">
        <div className="aspect-square h-full rounded flex justify-center items-center">
          <button className=" h-full rounded-sm bg-gray-200 flex flex-row justify-center items-center space-x-2 p-3">
            <Play size={15} fill="black" />
            <span className="text-sm">Present</span>
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
  );
};

export default Participants;
