import { PlusCircle } from "lucide-react";

export const CreateBoardButton = () => {
  return (
    <div className="w-64 h-32 bg-slate-100 rounded-md flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-700 active:scale-90 transition-transform">
      <PlusCircle size={64} className="" />
    </div>
  );
};
