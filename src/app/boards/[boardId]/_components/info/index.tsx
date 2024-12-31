import { ArrowLeft } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const Info = () => {
  const { boardName, teamId } = useContext(BoardContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute z-10 top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-4 p-4">
        <Link href={`/dashboard/${teamId}`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="hover:bg-gray-100 rounded-full p-2 transition-all shadow-sm"
          >
            <ArrowLeft size={24} className="text-blue-600" />
          </motion.div>
        </Link>
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold text-blue-500 tracking-wide">
            Teamscribe
          </span>
          <h2 className="font-bold text-gray-800 text-lg">{boardName}</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default Info;
