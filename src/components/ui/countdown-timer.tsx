"use client"

import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "lucide-react";
import { useCountdown, formatCountdown } from "@/hooks/useCountdown";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: string | Date;
  onEnd?: () => void;
  className?: string;
  showIcon?: boolean;
}

export function CountdownTimer({ 
  endTime, 
  onEnd, 
  className = "", 
  showIcon = true 
}: CountdownTimerProps) {
  const countdown = useCountdown(endTime);
  const [extended, setExtended] = useState(false);

  // Handle last-minute bid extension
  const extendTime = () => {
    if (countdown.isLastMinute) {
      setExtended(true);
      // Add 30 seconds to endTime
      const newEndTime = new Date(new Date(endTime).getTime() + 30000);
      return newEndTime;
    }
    return endTime;
  };

  useEffect(() => {
    if (countdown.isEnded && onEnd) {
      onEnd();
    }
  }, [countdown.isEnded, onEnd]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Timer className="w-4 h-4" />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={formatCountdown(countdown)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`font-mono ${
            countdown.isLastMinute 
              ? "text-red-500 font-bold" 
              : countdown.isEnded 
                ? "text-gray-500" 
                : ""
          }`}
        >
          {formatCountdown(countdown)}
          
          {/* Last-minute warning */}
          {countdown.isLastMinute && !countdown.isEnded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-500 absolute"
            >
              Last Chance!
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Auction ended notification */}
      <AnimatePresence>
        {countdown.isEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-gray-900 p-8 rounded-lg text-center max-w-md mx-4"
            >
              <h2 className="text-2xl font-bold text-purple-100 mb-4">
                Auction Ended!
              </h2>
              <p className="text-gray-400 mb-6">
                The final bid has been locked in. Winners will be notified shortly.
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 