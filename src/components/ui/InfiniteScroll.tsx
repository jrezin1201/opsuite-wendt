"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface InfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  children: React.ReactNode;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 100,
  children,
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          try {
            await onLoadMore();
          } finally {
            setIsLoading(false);
          }
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <>
      {children}

      {hasMore && (
        <div ref={loaderRef} className="py-8 flex justify-center">
          {(isLoading || loading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated Spinner */}
              <motion.div
                className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <p className="text-sm text-white/60">Loading more...</p>
            </motion.div>
          )}
        </div>
      )}

      {!hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 text-center"
        >
          <p className="text-sm text-white/40">No more items to load</p>
        </motion.div>
      )}
    </>
  );
}
