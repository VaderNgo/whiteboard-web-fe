"use client";
import { Hint } from "@/components/hint";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateBoardForm from "./create-board-form";

// export const CreateBoardButton = ({
//   disabled = false,
//   label = "Add board",
// }: {
//   disabled: boolean;
//   label: string;
// }) => {
//   const [isOpen, setOpen] = useState(false);

//   return (
//     <Dialog open={isOpen} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <div className="aspect-square">
//           <Hint label={label} side="right" sideOffset={10}>
//             <div
//               className="w-64 h-32 bg-slate-100 rounded-md flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-700 active:scale-90 transition-transform"
//               onClick={() => setOpen(!isOpen)}
//             >
//               <PlusCircle size={48} className="text-black" />
//             </div>
//           </Hint>
//         </div>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogTitle>Create a new board</DialogTitle>
//         <div className="flex gap-5">
//           <div className="flex-1 h-fit">
//             <CreateBoardForm onSubmitSuccess={async () => setOpen(false)} />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

export const CreateBoardButton = ({
  disabled = false,
  label = "Create board",
}: {
  disabled: boolean;
  label: string;
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Hint label={label} side="right" sideOffset={10}>
          <div
            className="w-64 h-32 bg-slate-100 rounded-md flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-700 active:scale-90 transition-transform"
            onClick={() => setOpen(!isOpen)}
          >
            <PlusCircle size={48} className="text-black" />
          </div>
        </Hint>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Create a new board</DialogTitle>
        <div className="flex gap-5">
          <div className="flex-1 h-fit">
            <CreateBoardForm onSubmitSuccess={async () => setOpen(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
