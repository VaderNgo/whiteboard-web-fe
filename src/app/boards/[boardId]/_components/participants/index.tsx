import { ChevronDown, User } from "lucide-react";

export const Participants = () => {
  const collaborators = [
    { imageUrl: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=user1", bgColor: "yellow" },
    { imageUrl: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=user2", bgColor: "blue" },
    { imageUrl: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=user3", bgColor: "green" },
    { imageUrl: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=user4", bgColor: "red" },
  ];

  const extraCount = collaborators.length > 3 ? collaborators.length - 2 : 0;

  // Determine which collaborators to show
  const visibleCollaborators = extraCount > 0 ? collaborators.slice(0, 2) : collaborators;
  return (
    <div className="absolute z-10 h-12 top-2 right-2 bg-green-300 rounded-e-md p-3 flex items-center shadow-md">
      <div className="flex justify-center items-center space-x-1">
        <div className="w-12 h-12 bg-white rounded"></div>
        <div className="w-12 h-12 bg-white rounded"></div>
        <div className="w-12 h-12 bg-white rounded"></div>

        <div className="relative flex items-center space-x-1">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex justify-center items-center border-2 border-blue-500">
            <img
              src="https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=tester1"
              alt="owner"
              className="w-full h-full rounded-full"
            />
          </div>

          <button className="w-10 h-6 bg-white rounded-lg flex items-center space-x-1 justify-center font-semibold text-black">
            <span>4</span>
            <ChevronDown className="size-3" />
          </button>

          {/* Collaborators */}
          <div className="relative -ml-4 flex">
            {visibleCollaborators.map((collaborator, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex justify-center items-center ${
                  index === 0 ? "z-20" : "z-10 -ml-2"
                } border-2 border-yellow-500`}
                style={{ backgroundColor: collaborator.bgColor }}
              >
                <img
                  src={collaborator.imageUrl}
                  alt={`collaborator-${index}`}
                  className="w-full h-full rounded-full"
                />
              </div>
            ))}
            {/* Show the extra count if there are more than 3 collaborators */}
            {extraCount > 0 && (
              <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center z-30 -ml-2 border-2 border-gray-400">
                <span className="text-sm">{extraCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
