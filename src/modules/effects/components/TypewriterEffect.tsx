"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterEffectProps {
  text: string;
  speed?: number; // milliseconds per character
  delay?: number; // initial delay before starting
  cursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterEffect({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
  className = "",
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(delay === 0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (delay === 0 || hasInitialized.current) return;

    hasInitialized.current = true;
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted || currentIndex >= text.length) {
      if (currentIndex >= text.length && !isComplete && onComplete) {
        queueMicrotask(() => {
          setIsComplete(true);
          onComplete();
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, hasStarted, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && !isComplete && (
        <span className="animate-pulse inline-block w-0.5 h-5 bg-current ml-0.5" />
      )}
    </span>
  );
}

// Multi-line variant with array of strings
interface TypewriterLinesProps {
  lines: string[];
  speed?: number;
  lineDelay?: number; // delay between lines
  cursor?: boolean;
  className?: string;
  lineClassName?: string;
}

export function TypewriterLines({
  lines,
  speed = 50,
  lineDelay = 500,
  cursor = true,
  className = "",
  lineClassName = "",
}: TypewriterLinesProps) {
  const [currentLine, setCurrentLine] = useState(0);

  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, lineDelay);
    }
  };

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <div key={index} className={lineClassName}>
          {index <= currentLine && (
            <TypewriterEffect
              text={line}
              speed={speed}
              cursor={cursor && index === currentLine}
              onComplete={index === currentLine ? handleLineComplete : undefined}
            />
          )}
        </div>
      ))}
    </div>
  );
}
