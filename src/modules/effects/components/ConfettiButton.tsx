"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Simple confetti effect using CSS animations (no external dependency)
interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

interface ConfettiButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  confettiCount?: number;
  colors?: string[];
  onClick?: () => void;
}

export function ConfettiButton({
  children,
  variant,
  size,
  confettiCount = 30,
  colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
  onClick,
}: ConfettiButtonProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerConfetti = () => {
    if (isAnimating) return;

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < confettiCount; i++) {
      pieces.push({
        id: Date.now() + i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.5 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setConfetti(pieces);
    setIsAnimating(true);

    // Clear confetti after animation
    setTimeout(() => {
      setConfetti([]);
      setIsAnimating(false);
    }, 3000);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative inline-block">
      <Button variant={variant} size={size} onClick={triggerConfetti}>
        {children}
      </Button>

      {/* Confetti container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 animate-confetti"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Standalone confetti trigger hook
export function useConfetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const fire = (options?: {
    count?: number;
    colors?: string[];
    origin?: { x: number; y: number };
  }) => {
    const count = options?.count || 50;
    const colors =
      options?.colors || [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ];

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      pieces.push({
        id: Date.now() + i,
        left: (options?.origin?.x || 50) + (Math.random() - 0.5) * 50,
        delay: Math.random() * 0.3,
        duration: 1.5 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setConfetti(pieces);

    setTimeout(() => {
      setConfetti([]);
    }, 3000);
  };

  const ConfettiContainer = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );

  return { fire, ConfettiContainer };
}

/*
Usage examples:

1. Button with built-in confetti:
<ConfettiButton onClick={() => console.log('Clicked!')}>
  Celebrate!
</ConfettiButton>

2. Custom trigger with hook:
function MyComponent() {
  const { fire, ConfettiContainer } = useConfetti();

  return (
    <>
      <button onClick={() => fire({ count: 100 })}>
        Fire Confetti!
      </button>
      <ConfettiContainer />
    </>
  );
}

3. Install canvas-confetti for advanced effects:
npm install canvas-confetti
Then import and use:
import confetti from 'canvas-confetti';
confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
*/
