import { ArrowLeft } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import useSocket from "../../_hooks/useSocket";

const Info = () => {
  const { boardName, teamId } = useContext(BoardContext);
  const { leaveBoard } = useSocket();
  console.log(teamId);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute z-10 top-2 left-2 bg-white rounded-md shadow-md"
    >
      <div className="flex items-center space-x-3 p-3">
        <Link href={`/dashboard/${teamId}`} onClick={leaveBoard}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ArrowLeft size={20} className="text-gray-600" />
          </motion.div>
        </Link>
        <h2 className="font-semibold text-gray-800">{boardName}</h2>
      </div>
    </motion.div>
  );
};
export default Info;
