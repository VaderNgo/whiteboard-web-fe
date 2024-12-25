import { MonitorDown, MonitorUp, MonitorX } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../../_contexts/boardContext";
import { useLoggedInUser } from "@/lib/services/queries";
import useSocket from "../../_hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";

const PresentationMember = () => {
  const { presentation, stageConfig } = useContext(BoardContext);
  const owner = useLoggedInUser();

  if (!presentation) return null;

  const isPresenter = presentation.presenter?.id === owner.data?.id;
  const participants = Array.from(presentation.participants.values());
  const visibleUsers = [
    presentation.presenter,
    ...participants.filter((user) => user.id !== presentation.presenter?.id),
  ].slice(0, 3);

  const extraCount = Math.max(0, participants.length - 2);
  const { startPresentation, joinPresentation, leavePresentation, endPresentation } = useSocket();
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

  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const avatarContainerVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const avatarVariants = {
    hover: {
      scale: 1.1,
      zIndex: 50,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute z-10 h-12 bottom-2 right-[50%] translate-x-1/2 bg-white rounded-md flex items-center shadow-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex h-full w-full justify-center items-center space-x-3 p-2">
          <motion.div
            className="flex items-center space-x-2"
            variants={avatarContainerVariants}
            whileHover="hover"
          >
            <div className="flex items-center">
              {visibleUsers.map((user, index) => (
                <motion.div
                  key={user?.id || index}
                  className={`w-8 h-8 rounded-full flex justify-center items-center border-2 
                    ${index === 0 ? "border-blue-500 z-30" : "border-yellow-500 -ml-2"} 
                    ${index === 1 ? "z-20" : ""} 
                    ${index === 2 ? "z-10" : ""}`}
                  variants={avatarVariants}
                  whileHover="hover"
                >
                  <motion.img
                    src={user?.avatar}
                    alt={`${index === 0 ? "presenter" : "participant"}-${index}`}
                    className="w-full h-full rounded-full"
                    variants={itemVariants}
                    animate={
                      index === 0
                        ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }
                        : {}
                    }
                  />
                </motion.div>
              ))}
              {extraCount > 0 && (
                <motion.div
                  className="w-8 h-8 bg-white rounded-full flex justify-center items-center -ml-2 border-2 border-gray-400"
                  variants={avatarVariants}
                  whileHover="hover"
                >
                  <motion.span className="text-sm" variants={itemVariants}>
                    +{extraCount}
                  </motion.span>
                </motion.div>
              )}
            </div>
            <motion.span className="text-sm font-medium" variants={itemVariants}>
              {participants.length + 1} members
            </motion.span>
          </motion.div>

          {presentation &&
            presentation.presenter?.id !== owner.data?.id &&
            presentation.participants
              .values()
              .find((enhancedUser) => enhancedUser.id === owner.data?.id) === undefined && (
              <motion.button
                className={`h-full rounded-sm flex flex-row justify-center items-center space-x-2 p-3 
                  bg-blue-400
              text-white`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handlePresentationClick(1)}
              >
                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <MonitorUp size={20} />
                </motion.div>
                <span className="text-sm">Join Presentation</span>
              </motion.button>
            )}

          {presentation && presentation?.presenter?.id === owner.data?.id && (
            <motion.button
              className={`h-full rounded-sm flex flex-row justify-center items-center space-x-2 p-3 
                  bg-red-400
              text-white`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handlePresentationClick(3)}
            >
              <motion.div
                animate={{ y: [-1, 1, -1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <MonitorX size={20} />
              </motion.div>
              <span className="text-sm">End Presentation</span>
            </motion.button>
          )}

          {presentation &&
            presentation?.presenter?.id !== owner.data?.id &&
            presentation.participants.size !== 0 &&
            presentation.participants
              .values()
              .find((enhancedUser) => enhancedUser.id === owner.data?.id) !== undefined && (
              <motion.button
                className={`h-full rounded-sm flex flex-row justify-center items-center space-x-2 p-3 
                  bg-red-400
              text-white`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handlePresentationClick(2)}
              >
                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <MonitorDown size={20} />
                </motion.div>
                <span className="text-sm">Leave Presentation</span>
              </motion.button>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PresentationMember;
