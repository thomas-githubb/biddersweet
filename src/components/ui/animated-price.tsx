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
    if (value > prevValue) {
      const diff = value - prevValue;
      setIncrease(diff);
      setIsIncreasing(true);
      setPrevValue(value);

      const timeout = setTimeout(() => {
        setIsIncreasing(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  return (
    <div className="relative">
      <div className={cn("flex items-center", className)}>
        <DollarSign className="w-4 h-4 mr-1" />
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold"
        >
          {value.toLocaleString()}
        </motion.span>
      </div>
      
      <AnimatePresence>
        {isIncreasing && (
          <>
            {/* Rising number with arrow */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -30 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute -top-1 left-0 text-green-400 font-bold flex items-center"
            >
              <ArrowUp className="w-3 h-3 mr-1" />
              +{Math.floor(increase).toLocaleString()}
            </motion.div>

            {/* Sparkles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [-10 + (i * 10), 0, 10 + (i * 10)],
                  y: [0, -20, -40]
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="absolute top-0 right-0 w-1 h-1 bg-purple-400 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 