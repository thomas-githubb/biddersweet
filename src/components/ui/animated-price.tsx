"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface AnimatedPriceProps {
  value: number
  className?: string
}

export function AnimatedPrice({ value, className }: AnimatedPriceProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [increase, setIncrease] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (value !== prevValue && value > prevValue) {
      const diff = value - prevValue;
      setIncrease(diff);
      setIsIncreasing(true);
      setPrevValue(value);
      
      timeout = setTimeout(() => {
        setIsIncreasing(false);
      }, 1500);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [value]);

  return (
    <div className="relative min-h-[30px]">
      <div className={cn("flex items-center", className)}>
        <span className="mr-1">$</span>
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="font-bold"
        >
          {value?.toLocaleString() || '0'}
        </motion.span>
      </div>
      
      <AnimatePresence>
        {isIncreasing && increase > 0 && (
          <>
            {/* Rising number with arrow - slightly higher */}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 text-green-400 font-bold flex items-center"
            >
              <ArrowUp className="w-3 h-3 mr-1" />
              +{Math.floor(increase).toLocaleString()}
            </motion.div>

            {/* Sparkles - adjusted to match */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [-10 + (i * 10), 0, 10 + (i * 10)],
                  y: [0, -10, -20]
                }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="absolute top-0 right-0 w-1 h-1 bg-purple-400 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 