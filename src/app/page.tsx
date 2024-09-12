"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderBar from "./_components/header-bar";
import InteractiveColorGrid from "./_components/interactive-color-grid";
import SignupButton from "./_components/signup-btn";
import TypewriterText from "./_components/typewriter-text";
import SignupForm from "./_components/signup-form";
import LoginForm from "./_components/login-form";

const TYPEWRITER_TEXTS = [
  "Make your team's ideas come to life",
  "Collaborate in real-time",
  "Share your whiteboard with anyone",
  "Made with love",
];

const SELECTION_STATES = {
  DEFAULT: "default",
  SIGNUP: "signup",
  LOGIN: "login",
} as const;

type SelectionState = (typeof SELECTION_STATES)[keyof typeof SELECTION_STATES];

const AnimatedContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={className}
    transition={{ duration: 0.5 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);

const Homepage = () => {
  const [selection, setSelection] = useState<SelectionState>(SELECTION_STATES.DEFAULT);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDefault, setShowDefault] = useState(true);

  // The reason we are use separete states for showing signup and login forms
  // is because if we used the selection state, React will update too quickly
  // for <AnimatePresence> to play the required exit animations

  useEffect(() => {
    if (selection === SELECTION_STATES.SIGNUP) {
      const timer = setTimeout(() => setShowSignup(true), 500);
    } else {
      setShowSignup(false);
    }

    if (selection === SELECTION_STATES.LOGIN) {
      const timer = setTimeout(() => setShowLogin(true), 500);
    } else {
      setShowLogin(false);
    }

    if (selection === SELECTION_STATES.DEFAULT) {
      const timer = setTimeout(() => {
        setShowDefault(true);
      }, 500);
    } else {
      setShowDefault(false);
    }
  }, [selection]);

  return (
    <div className="flex justify-center lg:justify-normal h-full w-full min-h-screen flex-col overflow-hidden">
      <HeaderBar onLogin={() => setSelection(SELECTION_STATES.LOGIN)} />
      <InteractiveColorGrid />

      <AnimatePresence>
        {showDefault && (
          <>
            <AnimatedContent className="z-[1] self-center mt-[15%] p-5 font-mono text-center text-2xl md:text-5xl font-bold bg-white/80 backdrop-blur-sm rounded-md pointer-events-none">
              <h1>
                A whiteboard designed for{" "}
                <span className="bg-blue-500 text-white px-2 rounded-md">teams</span>
                <TypewriterText texts={TYPEWRITER_TEXTS} />
              </h1>
            </AnimatedContent>

            <AnimatedContent className="mx-auto mt-16 z-[1]">
              <SignupButton
                onClick={() => setSelection(SELECTION_STATES.SIGNUP)}
                className="z-[1] w-fit font-mono font-bold text-sm md:text-base bg-blue-500/80 hover:bg-blue-500 active:hover:bg-blue-700 backdrop-blur-sm"
              />
            </AnimatedContent>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignup && (
          <AnimatedContent className="z-[1] self-center mt-[10%] w-full max-w-96 pointer-events-none">
            <SignupForm onClose={() => setSelection(SELECTION_STATES.DEFAULT)} />
          </AnimatedContent>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <AnimatedContent className="z-[1] self-center mt-[10%] w-full max-w-96 pointer-events-none">
            <LoginForm onClose={() => setSelection(SELECTION_STATES.DEFAULT)} />
          </AnimatedContent>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
