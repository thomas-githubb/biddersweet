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
      const timeout = setTimeout(() => {
        setIsIncreasing(false);
      }, 1000);
      setPrevValue(value);
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
        
        {/* Animated up arrow */}
        <AnimatePresence>
          {isIncreasing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: -10 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.8],
                x: [-10, 0, 10],
                y: [0, -10, -20]
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
              }}
              className="absolute -right-6 top-1"
            >
              <ArrowUp className="w-4 h-4 text-green-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {isIncreasing && (
          <>
            {/* Enhanced sparkle effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: [-10, 0, 10][i],
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  y: -40,
                  x: [-20, 0, 20][i],
                  rotate: 360
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut",
                  delay: i * 0.1
                }}
                className="absolute top-0 right-0 w-2 h-2"
                style={{
                  background: `linear-gradient(135deg, #9f7aea ${i * 30}%, #4c1d95)`
                }}
              />
            ))}
            
            {/* Enhanced glow effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 0.15, 0],
                scale: [0.8, 1.2, 1.5]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
            />
            
            {/* Rising number effect with enhanced animation */}
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ 
                opacity: [1, 0.8, 0],
                y: -30,
                scale: [0.8, 1.2, 1]
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute -top-1 left-0 text-green-400 font-bold flex items-center"
            >
              <ArrowUp className="w-3 h-3 mr-1" />
              +{Math.floor(increase).toLocaleString()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 