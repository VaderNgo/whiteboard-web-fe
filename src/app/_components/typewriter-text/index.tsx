"use client";

import { useEffect, useState } from "react";

type TypewriterTextProps = {
  texts: string[];
};

export default function TypewriterText({ texts }: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState(texts[currentTextIndex]);
  const [currentTextLength, setCurrentTextLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const typeSpeed = 150; // Speed of typing
    const deleteSpeed = 75; // Speed of deleting
    const pauseDuration = 10000; // 10 seconds pause

    let interval: NodeJS.Timeout;

    if (pause) {
      // Handle the pause after the text has been completed
      interval = setTimeout(() => {
        setPause(false);
        setIsDeleting(true);
      }, pauseDuration);
    } else {
      // Typing and deleting logic
      interval = setInterval(
        () => {
          if (isDeleting) {
            if (currentTextLength > 0) {
              setCurrentTextLength(currentTextLength - 1);
            } else {
              setIsDeleting(false);
              setCurrentTextIndex((currentTextIndex + 1) % texts.length);
              setCurrentText(texts[(currentTextIndex + 1) % texts.length]);
            }
          } else {
            if (currentTextLength < currentText.length) {
              setCurrentTextLength(currentTextLength + 1);
            } else {
              setPause(true);
              setIsDeleting(true);
            }
          }
        },
        isDeleting ? deleteSpeed : typeSpeed
      );
    }

    return () => clearInterval(interval);
  }, [currentTextLength, isDeleting, pause, currentTextIndex, currentText, texts]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="typewriter-container w-fit mt-5">
        <h1 className="z-[1] text-center font-semibold text-sm md:text-lg pointer-events-none text-wrap font-mono text-slate-700">
          {currentText.slice(0, currentTextLength) || "."}
        </h1>
      </div>
    </div>
  );
}
